#!/usr/bin/env -S npx tsx
/**
 * Content generation pipeline (Claude Fable 5.1 + Batch API).
 *
 * Generates unique, SB-37-compliant JSON for the California funnels:
 *   city pages -> data/content/california/<slug>.json
 *   6 silos    -> data/content/california/<slug>/<practice>.json
 * Select with --kind city|silo|both (default both). Existing files are skipped
 * unless --overwrite, so hand-authored flagship pages are preserved.
 *
 * Requires: npm install @anthropic-ai/sdk   (zod + tsx already in the project)
 * Auth:     ANTHROPIC_API_KEY env var, OR an "API credential" on the cloud
 *           environment (a proxy attaches it; the key never enters the session).
 * Note:     Fable 5.1 requires standard (30-day) data retention on your org.
 *
 * Commands:
 *   test                         verify auth with ONE minimal request (pennies)
 *   list                         population-ordered cities + how many silos exist
 *   prompts <slug> [practice]    print the exact prompts (no API spend)
 *   submit [opts]                create a Batch and print its id + est. cost
 *   status <batchId>             show batch processing status/counts
 *   fetch  <batchId>             download results, write files, report failures
 *
 * submit options:
 *   --limit N            only the N largest cities (by population)
 *   --only a,b,c         only these city slugs
 *   --kind K             city | silo | both (default both)
 *   --practices x,y      only these practice slugs (default: all 6)
 *   --overwrite          regenerate pages that already exist (default: skip)
 *   --model ID           model override (default claude-fable-5-1; claude-sonnet-5 is ~5x cheaper)
 *   --effort E           low|medium|high|xhigh|max (default low). On thinking-always-on
 *                        models this is the DOMINANT cost lever: thinking bills as output.
 *   --dry-run            build + count requests, print est. cost, do NOT submit
 */
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { promises as fs } from 'fs';
import path from 'path';
import { loadFacts, type CityFacts } from './facts';
import {
  PRACTICES, type Practice, SiloSchema, CityPageSchema,
  SYSTEM_PROMPT, buildUserPrompt, buildCityUserPrompt, PRACTICE_LABEL,
} from './prompts';

const ROOT = process.cwd();
const ACCIDENT_DIR = path.join(ROOT, 'data', 'accident', 'california');
const CONTENT_DIR = path.join(ROOT, 'data', 'content', 'california');
const BATCH_DIR = path.join(ROOT, 'scripts', 'generate-silos', '.batches');
// The authoritative routing/sitemap list the app serves. The crash dataset also
// contains non-city jurisdictions (park districts, university & airport police,
// harbors, military bases) and a few alternate slugs; generating for anything
// outside this list produces pages that never route. We intersect the two.
const CITY_LIST = path.join(ROOT, 'data', 'states', 'california-cities.json');
const MODEL = 'claude-fable-5-1';
// List price $/MTok. Batch API is 50% off both sides.
const PRICES: Record<string, { in: number; out: number }> = {
  'claude-fable-5-1': { in: 10, out: 50 },
  'claude-opus-5': { in: 5, out: 25 },
  'claude-sonnet-5': { in: 2, out: 10 },
  'claude-haiku-4-5': { in: 1, out: 5 },
};
const priceFor = (m: string) => PRICES[m] ?? PRICES[MODEL];

// MEASURED, not guessed. The first ~525-page run on Fable at effort "medium" billed
// ~$0.142/page, which works back to ~5,500 output tokens/page against ~721 input.
// Visible JSON is only ~1,000 of that — the rest is thinking, which bills as output.
// Effort is therefore the dominant cost lever on a thinking-always-on model.
const EST_IN = 750;
const EST_OUT_BY_EFFORT: Record<string, number> = {
  low: 2000, medium: 5500, high: 9000, xhigh: 14000, max: 20000,
};

function parseArgs(argv: string[]) {
  const o: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { o[key] = next; i++; } else { o[key] = true; }
    }
  }
  return o;
}

let _routable: Set<string> | null = null;
// Slugs the app actually routes (data/states/california-cities.json).
async function routableSlugs(): Promise<Set<string>> {
  if (_routable) return _routable;
  const cities = JSON.parse(await fs.readFile(CITY_LIST, 'utf-8'));
  _routable = new Set<string>(cities.map((c: any) => c.slug));
  return _routable;
}

// Accident-data slugs that are ALSO real, routable cities. Excludes park/campus/
// airport/harbor jurisdictions and alternate slugs that would orphan the page.
async function allSlugs(): Promise<string[]> {
  const files = await fs.readdir(ACCIDENT_DIR);
  const routable = await routableSlugs();
  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -5))
    .filter((slug) => routable.has(slug));
}

async function citiesByPopulation(): Promise<CityFacts[]> {
  const slugs = await allSlugs();
  const facts: CityFacts[] = [];
  for (const s of slugs) {
    try { facts.push(await loadFacts(s, ACCIDENT_DIR)); } catch { /* skip unreadable */ }
  }
  facts.sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
  return facts;
}

/**
 * Build the SDK client.
 *
 * Two supported auth paths:
 *  1. ANTHROPIC_API_KEY in the environment (local runs, `export ANTHROPIC_API_KEY=...`).
 *  2. An "API credential" configured on the cloud environment — a proxy attaches the
 *     real credential to requests for api.anthropic.com and the key never reaches the
 *     session. The SDK still needs a non-empty apiKey to construct, so we pass a
 *     placeholder that the proxy replaces.
 */
/**
 * Resolve the console API key.
 *
 * NOTE: Claude Code cloud environments deliberately STRIP `ANTHROPIC_API_KEY`
 * from session env ("won't be used to authenticate requests — sessions are
 * authenticated through your Anthropic account"). So for a cloud run, store the
 * key under PIPELINE_API_KEY instead. ANTHROPIC_API_KEY still works for local
 * runs, where nothing strips it.
 */
export function resolveApiKey(): string | undefined {
  return process.env.PIPELINE_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? undefined;
}

function makeClient(): Anthropic {
  // Claude Code sessions set ANTHROPIC_BASE_URL to an internal agent proxy, and the
  // SDK picks that up automatically. This pipeline must talk to the real public API
  // with YOUR console key, so pin the base URL explicitly rather than inheriting it.
  const key = resolveApiKey();
  // Vault mode: when no key is in the env, an "API credential" configured on the
  // environment supplies x-api-key at the proxy. Pass null so the SDK does NOT
  // send its own placeholder x-api-key that could collide with the injected one.
  return new Anthropic({
    apiKey: key ?? null,
    baseURL: 'https://api.anthropic.com',
  });
}

// A target is either the general city page (kind 'city') or one practice silo.
type Kind = 'city' | Practice;

async function targetExists(slug: string, kind: Kind): Promise<boolean> {
  const p = kind === 'city' ? path.join(CONTENT_DIR, `${slug}.json`) : path.join(CONTENT_DIR, slug, `${kind}.json`);
  try { await fs.access(p); return true; } catch { return false; }
}

async function writeResult(slug: string, kind: Kind, data: any, model: string) {
  const date = new Date().toISOString().slice(0, 10);
  if (kind === 'city') {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    const out = { _meta: { voice: 'brand-standard', model, generatedAt: date, note: `${slug} city page (Fable pipeline).` }, ...data };
    await fs.writeFile(path.join(CONTENT_DIR, `${slug}.json`), JSON.stringify(out, null, 2) + '\n', 'utf-8');
  } else {
    const dir = path.join(CONTENT_DIR, slug);
    await fs.mkdir(dir, { recursive: true });
    const out = { _meta: { voice: 'brand-standard', model, generatedAt: date, practice: kind, note: `${slug} ${kind} silo (Fable pipeline).` }, ...data };
    await fs.writeFile(path.join(dir, `${kind}.json`), JSON.stringify(out, null, 2) + '\n', 'utf-8');
  }
}

const FORMAT_SILO = { type: 'json_schema', schema: (zodOutputFormat(SiloSchema) as any).schema };
const FORMAT_CITY = { type: 'json_schema', schema: (zodOutputFormat(CityPageSchema) as any).schema };

function buildRequest(facts: CityFacts, kind: Kind, model: string, effort: string) {
  const isCity = kind === 'city';
  return {
    custom_id: `${facts.slug}__${kind}`,
    params: {
      model,
      // 8000, not 4000: on longer pages (wrongful-death especially) medium/high
      // effort spends the budget on thinking + prose and truncates before the
      // trailing whyChoose/faq arrays, which then come back empty. Headroom fixes
      // that; pages that don't need it cost no more.
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user' as const, content: isCity ? buildCityUserPrompt(facts) : buildUserPrompt(facts, kind) }],
      output_config: { effort, format: isCity ? FORMAT_CITY : FORMAT_SILO },
    },
  };
}

function parseCustomId(id: string): { slug: string; kind: Kind } {
  const idx = id.lastIndexOf('__');
  return { slug: id.slice(0, idx), kind: id.slice(idx + 2) as Kind };
}

function kindsFromOpts(o: Record<string, string | boolean>): Kind[] {
  const kind = typeof o.kind === 'string' ? o.kind : 'both';
  const practices: Practice[] = typeof o.practices === 'string' ? (o.practices.split(',') as Practice[]) : [...PRACTICES];
  if (kind === 'city') return ['city'];
  if (kind === 'silo') return practices;
  return ['city', ...practices];
}

// ─────────────────────────── commands ───────────────────────────
async function cmdList() {
  const cities = await citiesByPopulation();
  const allFiles = (await fs.readdir(ACCIDENT_DIR)).filter((f) => f.endsWith('.json')).length;
  let cityDone = 0, siloDone = 0;
  for (const c of cities) {
    if (await targetExists(c.slug, 'city')) cityDone++;
    for (const p of PRACTICES) if (await targetExists(c.slug, p)) siloDone++;
  }
  console.log(`Routable cities: ${cities.length}  (${allFiles} crash-data jurisdictions; ${allFiles - cities.length} non-city/unroutable skipped)`);
  console.log(`City pages: ${cityDone}/${cities.length} | Silos: ${siloDone}/${cities.length * PRACTICES.length}`);
  console.log('Top 20 by population:');
  for (const c of cities.slice(0, 20)) {
    let silos = 0;
    for (const p of PRACTICES) if (await targetExists(c.slug, p)) silos++;
    const city = (await targetExists(c.slug, 'city')) ? '✓' : '·';
    console.log(`  ${String(c.population ?? 0).padStart(9)}  ${c.slug.padEnd(22)} city ${city}  silos ${silos}/6`);
  }
}

async function cmdPrompts(slug: string, which?: string) {
  const facts = await loadFacts(slug, ACCIDENT_DIR);
  const list: Kind[] = which ? [which as Kind] : ['city', ...PRACTICES];
  for (const k of list) {
    console.log(`\n===== ${slug} / ${k} =====`);
    console.log('--- SYSTEM ---\n' + SYSTEM_PROMPT);
    console.log('\n--- USER ---\n' + (k === 'city' ? buildCityUserPrompt(facts) : buildUserPrompt(facts, k as Practice)));
  }
}

async function selectTargets(o: Record<string, string | boolean>) {
  let cities = await citiesByPopulation();
  if (typeof o.only === 'string') {
    const set = new Set(o.only.split(','));
    cities = cities.filter((c) => set.has(c.slug));
  }
  if (typeof o.limit === 'string') cities = cities.slice(0, parseInt(o.limit, 10));
  const kinds = kindsFromOpts(o);
  const targets: { facts: CityFacts; kind: Kind }[] = [];
  for (const c of cities) {
    for (const k of kinds) {
      if (!o.overwrite && (await targetExists(c.slug, k))) continue;
      targets.push({ facts: c, kind: k });
    }
  }
  return targets;
}

async function cmdSubmit(o: Record<string, string | boolean>) {
  const model = typeof o.model === 'string' ? o.model : MODEL;
  const targets = await selectTargets(o);
  if (!targets.length) { console.log('Nothing to generate (all selected pages already exist; use --overwrite).'); return; }

  const effort = typeof o.effort === 'string' ? o.effort : 'low';
  const requests = targets.map((t) => buildRequest(t.facts, t.kind, model, effort));
  const p = priceFor(model);
  const perOut = EST_OUT_BY_EFFORT[effort] ?? EST_OUT_BY_EFFORT.low;
  const estIn = requests.length * EST_IN, estOut = requests.length * perOut;
  const cost = ((estIn / 1e6) * p.in + (estOut / 1e6) * p.out) * 0.5;
  const nCity = targets.filter((t) => t.kind === 'city').length;
  console.log(`Targets: ${requests.length} pages (${nCity} city, ${requests.length - nCity} silo) across ${new Set(targets.map((t) => t.facts.slug)).size} cities.`);
  console.log(`Model: ${model}  |  effort: ${effort}  |  est. output ~${perOut.toLocaleString()} tok/page (thinking included)`);
  console.log(`Estimated batch cost: ~$${cost.toFixed(2)}  (batch pricing, 50% off ${p.in}/${p.out} per MTok)`);
  console.log(`NOTE: estimate only. \`fetch\` reports the ACTUAL billed usage for this batch.`);

  if (o['dry-run']) { console.log('Dry run — not submitted.'); return; }

  const client = makeClient();
  const batch = await client.messages.batches.create({ requests: requests as any });
  await fs.mkdir(BATCH_DIR, { recursive: true });
  await fs.writeFile(path.join(BATCH_DIR, `${batch.id}.json`), JSON.stringify({ id: batch.id, model, count: requests.length, createdAt: new Date().toISOString() }, null, 2));
  console.log(`\nSubmitted batch: ${batch.id}`);
  console.log(`Track with:  npx tsx scripts/generate-silos/index.ts status ${batch.id}`);
  console.log(`Fetch with:  npx tsx scripts/generate-silos/index.ts fetch ${batch.id}`);
}

async function cmdTest(o: Record<string, string | boolean>) {
  const model = typeof o.model === 'string' ? o.model : MODEL;
  const key = resolveApiKey();
  const src = process.env.PIPELINE_API_KEY ? 'PIPELINE_API_KEY'
            : process.env.ANTHROPIC_API_KEY ? 'ANTHROPIC_API_KEY' : 'none';
  console.log(`Key source        : ${src}`);
  console.log(`Key               : ${key ? `set (${key.length} chars, starts "${key.slice(0, 7)}")` : 'NOT SET'}`);
  if (src === 'none') {
    console.log('-> No key in env: running in VAULT mode (an API credential on the environment');
    console.log('   must supply the x-api-key header for api.anthropic.com).');
  }
  if (key && /your-actual-key|your-key-here|sk-ant-xxx/.test(key)) {
    console.log('\n! That looks like placeholder text, not a real key.');
  }
  console.log(`ANTHROPIC_BASE_URL: ${process.env.ANTHROPIC_BASE_URL ?? '(unset)'} — pinned to https://api.anthropic.com regardless`);
  console.log(`Model             : ${model}`);
  if (key && key.length < 50) {
    console.log('\n! Key looks short for an Anthropic key (usually ~100+ chars) — possible truncated paste.');
  }
  console.log('\nSending one minimal request…');
  try {
    const r = await makeClient().messages.create({
      model,
      max_tokens: 8,
      messages: [{ role: 'user', content: 'Reply with the single word: ok' }],
    });
    const text = r.content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('').trim();
    console.log(`\nSUCCESS — model replied: "${text}"`);
    console.log(`usage: in=${r.usage.input_tokens} out=${r.usage.output_tokens}`);
    console.log('\nAuth works. Safe to run: submit --limit 5');
  } catch (e: any) {
    console.log(`\nFAILED — ${e?.constructor?.name ?? 'Error'}${e?.status ? ` (HTTP ${e.status})` : ''}`);
    console.log(String(e?.message ?? e).slice(0, 400));
    if (e?.status === 401) console.log('\n-> 401: key is missing, wrong, or truncated. Re-check the env var value.');
    if (e?.status === 400 && /retention/i.test(String(e?.message))) {
      console.log('\n-> Fable 5.1 needs standard (30-day) data retention. Retry with --model claude-sonnet-5.');
    }
    if (e?.status === 400 && /credit|billing/i.test(String(e?.message))) {
      console.log('\n-> Looks like a billing/credit problem. Check the credit balance in the console.');
    }
    process.exitCode = 1;
  }
}

async function cmdStatus(id: string) {
  const client = makeClient();
  const b = await client.messages.batches.retrieve(id);
  console.log(`Batch ${id}: ${b.processing_status}`);
  console.log(JSON.stringify(b.request_counts, null, 2));
}

async function cmdFetch(id: string) {
  const client = makeClient();
  let b = await client.messages.batches.retrieve(id);
  while (b.processing_status !== 'ended') {
    console.log(`  status: ${b.processing_status} — waiting 30s…`);
    await new Promise((r) => setTimeout(r, 30_000));
    b = await client.messages.batches.retrieve(id);
  }
  const manifestPath = path.join(BATCH_DIR, `${id}.json`);
  let model = MODEL;
  try { model = JSON.parse(await fs.readFile(manifestPath, 'utf-8')).model ?? MODEL; } catch { /* ok */ }

  let ok = 0;
  let totIn = 0, totOut = 0;   // ACTUAL billed usage, summed from the batch results
  const failures: { custom_id: string; reason: string }[] = [];
  for await (const entry of await client.messages.batches.results(id)) {
    const { slug, kind } = parseCustomId(entry.custom_id);
    if (entry.result.type !== 'succeeded') { failures.push({ custom_id: entry.custom_id, reason: entry.result.type }); continue; }
    const msg = entry.result.message;
    totIn += msg.usage?.input_tokens ?? 0;
    totOut += msg.usage?.output_tokens ?? 0;
    if (msg.stop_reason === 'refusal') { failures.push({ custom_id: entry.custom_id, reason: 'refusal' }); continue; }
    const text = msg.content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('');
    let parsed: any;
    try { parsed = JSON.parse(text); } catch { failures.push({ custom_id: entry.custom_id, reason: 'json_parse' }); continue; }
    const check = (kind === 'city' ? CityPageSchema : SiloSchema).safeParse(parsed);
    if (!check.success) { failures.push({ custom_id: entry.custom_id, reason: 'schema' }); continue; }
    await writeResult(slug, kind, check.data, model);
    ok++;
  }
  console.log(`\nWrote ${ok} pages.`);

  // Actual spend for this batch, from billed usage — not an estimate.
  const p = priceFor(model);
  const cost = ((totIn / 1e6) * p.in + (totOut / 1e6) * p.out) * 0.5;
  const pages = ok + failures.length;
  console.log('\n── ACTUAL billed usage for this batch ──');
  console.log(`  model        : ${model}`);
  console.log(`  input tokens : ${totIn.toLocaleString()}`);
  console.log(`  output tokens: ${totOut.toLocaleString()}  (includes thinking)`);
  if (pages) {
    console.log(`  per page     : ${Math.round(totIn / pages).toLocaleString()} in / ${Math.round(totOut / pages).toLocaleString()} out`);
  }
  console.log(`  COST         : $${cost.toFixed(2)}${pages ? `  ($${(cost / pages).toFixed(4)}/page)` : ''}`);
  if (pages) {
    const remaining = 545 * 7 - 0; // upper bound: every city page + 6 silos
    console.log(`  -> at this rate, a full 545-city run (~${remaining.toLocaleString()} pages) would cost ~$${((cost / pages) * remaining).toFixed(0)}`);
  }
  if (failures.length) {
    const failFile = path.join(BATCH_DIR, `${id}.failures.json`);
    await fs.writeFile(failFile, JSON.stringify(failures, null, 2));
    const slugs = [...new Set(failures.map((f) => parseCustomId(f.custom_id).slug))];
    console.log(`${failures.length} failed (see ${failFile}).`);
    console.log(`Retry those cities with:\n  npx tsx scripts/generate-silos/index.ts submit --only ${slugs.join(',')} --overwrite`);
  }
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const o = parseArgs(rest);
  switch (cmd) {
    case 'list': return cmdList();
    case 'test': return cmdTest(o);
    case 'prompts': return cmdPrompts(rest[0], rest[1]);
    case 'submit': return cmdSubmit(o);
    case 'status': return cmdStatus(rest[0]);
    case 'fetch': return cmdFetch(rest[0]);
    default:
      console.log('Usage: index.ts <test|list|prompts|submit|status|fetch> [args]\nSee the header comment for options.');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
