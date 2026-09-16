#!/usr/bin/env -S npx tsx
/**
 * Content compliance + structure validator.
 *
 * Scans every generated/hand-written content file under data/content/<state>/
 * and fails on SB-37 / brand-safety violations and schema problems, BEFORE the
 * copy reaches production. Run it after every pipeline fetch.
 *
 *   npx tsx scripts/validate-content.ts            # all states
 *   npx tsx scripts/validate-content.ts california # one state
 *
 * Exit code 1 if any ERROR is found (safe for CI).
 */
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'data', 'content');

type Sev = 'ERROR' | 'WARN';
interface Issue { file: string; sev: Sev; rule: string; detail: string }

const PRACTICES = ['car-accident','slip-and-fall','medical-malpractice','workplace-injury','product-liability','wrongful-death'];

// ── compliance rules: applied to every string value in the document ──
const BANNED: { rule: string; re: RegExp; sev: Sev; why: string; allowIfNegated?: boolean; allowFollowing?: RegExp }[] = [
  { rule: 'dollar-figure', re: /\$\s?\d/, sev: 'ERROR', why: 'no settlement/verdict amounts allowed' },
  // allowIfNegated: an affirmative outcome guarantee is banned, but a compliant
  // disclaimer ("no attorney can guarantee…", "nothing is guaranteed") must pass
  // (see isNegated). allowFollowing: "guaranteed benefits" is the accurate,
  // standard description of the workers'-comp statutory bargain, not an outcome
  // promise, so it passes too.
  { rule: 'guarantee', re: /\b(guarantee[ds]?|guaranteeing|we will win|promise you|assured outcome)\b/i, sev: 'ERROR', why: 'no outcome guarantees', allowIfNegated: true, allowFollowing: /^\s+benefits?\b/i },
  { rule: 'superlative', re: /\b(#\s?1|number one|best (lawyer|attorney|firm)|top[- ]rated|most trusted|leading firm)\b/i, sev: 'ERROR', why: 'no ranking/superlative claims' },
  { rule: 'danger-verdict', re: /\b(most dangerous|dangerous (road|street|intersection|highway|corridor)|deadliest|worst (road|street|intersection))\b/i, sev: 'ERROR', why: 'crash data must stay neutral public-record framing' },
  { rule: 'bar-number', re: /\bbar\s*(no\.?|number|#)/i, sev: 'ERROR', why: 'attorney identity is auto-populated, never in generated copy' },
  // Only the unambiguous markers (Esq., LLP, PLLC). The old "Attorney X Y" heuristic
  // false-flagged title-case headings ("What an Attorney Can Do …"); bar numbers are
  // covered by the separate bar-number rule.
  { rule: 'attorney-name', re: /(\besq\.?\b|,\s*(?:LLP|PLLC)\b)/i, sev: 'ERROR', why: 'no named attorneys/firms (Esq./LLP/PLLC)' },
  { rule: 'phone-number', re: /(\(\d{3}\)\s*\d{3}[-.\s]?\d{4}|\b\d{3}[-.]\d{3}[-.]\d{4}\b)/, sev: 'ERROR', why: 'no hardcoded phone numbers' },
  { rule: 'claims-to-be-firm', re: /\bwe are a law firm\b/i, sev: 'ERROR', why: 'LawProactive is a connection service, not a law firm' },
  { rule: 'fake-review', re: /\b(5[- ]star|five[- ]star)\b/i, sev: 'WARN', why: 'reviews are renter-managed in the CMS' },
  // Stub content from a truncated/failed generation. Must never ship — it renders
  // the literal word on the page. ERROR so CI blocks it and it gets regenerated.
  { rule: 'placeholder', re: /\bplaceholder\b/i, sev: 'ERROR', why: 'stub/placeholder copy — regenerate this file' },
];

// Negators that, appearing just before a banned stem, turn it into a compliant
// disclaimer ("no attorney can guarantee", "we don't guarantee", "nothing is
// ever guaranteed"). Includes any "…n't" contraction (don't/doesn't/won't/isn't…).
const NEGATOR = /\b([a-z]+n['’]?t|no|not|never|cannot|without|nothing|none|neither|no[-\s]?one)\b/i;

// True if a banned match at `idx` is negated by a word within ~8 tokens before it.
// (8, not 6: "No outcome or dollar amount is ever guaranteed" puts the negator 7 back.)
function isNegated(s: string, idx: number): boolean {
  const preceding = s.slice(0, idx).split(/\s+/).filter(Boolean).slice(-8).join(' ');
  return NEGATOR.test(preceding);
}

// Apply every BANNED rule to one string, honoring allowIfNegated. Shared by the
// file walker and the self-test so both exercise identical logic.
function scanString(s: string): { sev: Sev; rule: string; match: string; why: string }[] {
  const out: { sev: Sev; rule: string; match: string; why: string }[] = [];
  for (const b of BANNED) {
    if (b.allowIfNegated) {
      const g = new RegExp(b.re.source, b.re.flags.includes('g') ? b.re.flags : b.re.flags + 'g');
      for (const m of s.matchAll(g)) {
        if (typeof m.index === 'number') {
          if (isNegated(s, m.index)) continue;
          if (b.allowFollowing && b.allowFollowing.test(s.slice(m.index + m[0].length))) continue;
        }
        out.push({ sev: b.sev, rule: b.rule, match: m[0], why: b.why });
      }
    } else {
      const m = s.match(b.re);
      if (m) out.push({ sev: b.sev, rule: b.rule, match: m[0], why: b.why });
    }
  }
  return out;
}

function walkStrings(node: any, cb: (s: string, p: string) => void, p = '') {
  if (typeof node === 'string') return cb(node, p);
  if (Array.isArray(node)) return node.forEach((v, i) => walkStrings(v, cb, `${p}[${i}]`));
  if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walkStrings(v, cb, p ? `${p}.${k}` : k);
}

function words(s: string) { return s.trim().split(/\s+/).filter(Boolean).length; }

function checkStructure(doc: any, isCity: boolean, add: (s: Sev, r: string, d: string) => void) {
  const need = (cond: any, rule: string, detail: string) => { if (!cond) add('ERROR', rule, detail); };

  need(doc?.seo?.metaTitle, 'missing', 'seo.metaTitle');
  need(doc?.seo?.metaDescription, 'missing', 'seo.metaDescription');
  need(doc?.hero?.subtitle, 'missing', 'hero.subtitle');
  need(doc?.about?.longDescription, 'missing', 'about.longDescription');
  need(Array.isArray(doc?.about?.commonInjuries), 'missing', 'about.commonInjuries');
  need(Array.isArray(doc?.whyChoose?.items), 'missing', 'whyChoose.items');
  need(Array.isArray(doc?.faq?.items), 'missing', 'faq.items');

  const t = doc?.seo?.metaTitle ?? '', d = doc?.seo?.metaDescription ?? '';
  if (t.length > 60) add('WARN', 'length', `metaTitle ${t.length} chars (>60)`);
  if (d.length > 155) add('WARN', 'length', `metaDescription ${d.length} chars (>155)`);

  // deepMerge (lib/page-content.ts) SKIPS empty arrays and empty strings, so an empty
  // value here does not render blank — it silently falls back to the shared template.
  // For arrays that means this city serves the GENERIC template copy, identical to every
  // other city that failed the same way: exactly the duplicate content this pipeline
  // exists to prevent. So empty arrays are errors (regenerate), empty headings are not.
  // `want` is a MINIMUM, not an exact count. A thin array (fewer than `want`)
  // risks falling back toward generic/duplicate copy, so it is flagged; extra
  // unique items (e.g. 4 FAQs where 3 are asked) only add value and are fine.
  const countCheck = (arr: any, want: number, label: string) => {
    if (!Array.isArray(arr)) return;
    if (arr.length === 0) add('ERROR', 'empty', `${label} is EMPTY — page falls back to generic template copy (regenerate this file)`);
    else if (arr.length < want) add('WARN', 'count', `${label} = ${arr.length} (want ${want}+)`);
  };

  countCheck(doc?.about?.commonInjuries, 6, 'about.commonInjuries');
  countCheck(doc?.whyChoose?.items, isCity ? 4 : 3, 'whyChoose.items');
  countCheck(doc?.faq?.items, isCity ? 5 : 3, 'faq.items');

  // Empty headings fall back to the template's default heading — cosmetic only.
  for (const [path, val] of [
    ['whyChoose.title', doc?.whyChoose?.title],
    ['about.title', doc?.about?.title],
    ['about.commonInjuriesTitle', doc?.about?.commonInjuriesTitle],
  ] as [string, any][]) {
    if (val !== undefined && String(val).trim() === '') {
      add('WARN', 'empty-heading', `${path} is empty — template default heading will be used`);
    }
  }

  const ld = doc?.about?.longDescription ?? '';
  const w = words(ld);
  const [lo, hi] = isCity ? [140, 240] : [110, 200];
  if (ld && (w < lo || w > hi)) add('WARN', 'length', `about.longDescription ${w} words (want ${lo}-${hi})`);

  if (isCity) {
    need(Array.isArray(doc?.painPoints?.items), 'missing', 'painPoints.items');
    const pp = doc?.painPoints?.items;
    if (Array.isArray(pp) && pp.length < 4) add('WARN', 'count', `painPoints.items = ${pp.length} (want 4+)`);
  }

  // Every generated page must disclaim the firm relationship somewhere.
  if (isCity && ld && !/not a law firm/i.test(ld)) {
    add('WARN', 'disclaimer', 'city about.longDescription does not say "not a law firm"');
  }
}

async function validateFile(file: string, isCity: boolean): Promise<Issue[]> {
  const rel = path.relative(ROOT, file);
  const issues: Issue[] = [];
  const add = (sev: Sev, rule: string, detail: string) => issues.push({ file: rel, sev, rule, detail });

  let doc: any;
  try {
    doc = JSON.parse((await fs.readFile(file, 'utf-8')).replace(/^﻿/, ''));
  } catch (e) {
    add('ERROR', 'json', `unparseable: ${(e as Error).message}`);
    return issues;
  }

  checkStructure(doc, isCity, add);

  walkStrings(doc, (s, p) => {
    if (p.startsWith('_meta')) return; // internal notes aren't shipped copy
    for (const hit of scanString(s)) add(hit.sev, hit.rule, `${p}: "${hit.match}" — ${hit.why}`);
  });

  return issues;
}

// Locks in the guarantee/attorney-name behavior so a future edit can't silently
// regress it. Run: npx tsx scripts/validate-content.ts --selftest
function runSelfTests(): number {
  const cases: { s: string; rule: string; expect: boolean }[] = [
    // guarantee — compliant negated disclaimers must PASS
    { s: 'No attorney can guarantee an outcome.', rule: 'guarantee', expect: false },
    { s: 'Nothing about the case is guaranteed.', rule: 'guarantee', expect: false },
    { s: 'valuing your claim without anyone guaranteeing a number', rule: 'guarantee', expect: false },
    { s: 'no one can promise you a particular result', rule: 'guarantee', expect: false },
    // guarantee — affirmative claims must still FAIL
    { s: 'We guarantee results for every client.', rule: 'guarantee', expect: true },
    { s: 'A guaranteed settlement in weeks.', rule: 'guarantee', expect: true },
    { s: 'Hire us and we will win your case.', rule: 'guarantee', expect: true },
    { s: 'An assured outcome you can count on.', rule: 'guarantee', expect: true },
    // guarantee — "guaranteed benefits" (workers'-comp statutory bargain) must PASS
    { s: "Workers' comp is the trade-off: guaranteed benefits without proving fault.", rule: 'guarantee', expect: false },
    { s: 'The system provides guaranteed benefits regardless of fault.', rule: 'guarantee', expect: false },
    // guarantee — contraction + far negator disclaimers must PASS
    { s: 'LawProactive is a free connection service, and we don\'t guarantee any outcome.', rule: 'guarantee', expect: false },
    { s: 'No outcome or dollar amount is ever guaranteed.', rule: 'guarantee', expect: false },
    // attorney-name — title-case headings must PASS
    { s: 'Why Work With an Attorney on Your Glendale Fall Claim', rule: 'attorney-name', expect: false },
    { s: 'What an Attorney Can Do for You', rule: 'attorney-name', expect: false },
    // attorney-name — real names/firms must still FAIL
    { s: 'Attorney Jane Doe, Esq.', rule: 'attorney-name', expect: true },
    { s: 'Represented by Smith & Jones, LLP', rule: 'attorney-name', expect: true },
  ];
  let failed = 0;
  for (const c of cases) {
    const hit = scanString(c.s).some((h) => h.rule === c.rule);
    const ok = hit === c.expect;
    if (!ok) failed++;
    console.log(`${ok ? 'ok  ' : 'FAIL'}  [${c.rule}] expect ${c.expect ? 'flag' : 'clean'}: ${JSON.stringify(c.s)}`);
  }
  console.log(`\n${failed ? `SELFTEST FAILED (${failed} case(s))` : 'SELFTEST PASSED'}`);
  return failed ? 1 : 0;
}

async function main() {
  const stateArg = process.argv[2];
  if (stateArg === '--selftest') { process.exit(runSelfTests()); }
  const states = stateArg ? [stateArg] : await fs.readdir(CONTENT).catch(() => []);
  const all: Issue[] = [];
  let nCity = 0, nSilo = 0;

  for (const state of states) {
    const dir = path.join(CONTENT, state);
    let entries: string[];
    try { entries = await fs.readdir(dir); } catch { continue; }

    for (const e of entries) {
      const full = path.join(dir, e);
      const st = await fs.stat(full);
      if (st.isFile() && e.endsWith('.json')) {
        nCity++; all.push(...(await validateFile(full, true)));
      } else if (st.isDirectory()) {
        for (const f of await fs.readdir(full)) {
          if (!f.endsWith('.json')) continue;
          const slug = f.slice(0, -5);
          if (!PRACTICES.includes(slug)) all.push({ file: path.relative(ROOT, path.join(full, f)), sev: 'WARN', rule: 'unknown-practice', detail: slug });
          nSilo++; all.push(...(await validateFile(path.join(full, f), false)));
        }
      }
    }
  }

  const errors = all.filter((i) => i.sev === 'ERROR');
  const warns = all.filter((i) => i.sev === 'WARN');

  const byFile = new Map<string, Issue[]>();
  for (const i of all) { if (!byFile.has(i.file)) byFile.set(i.file, []); byFile.get(i.file)!.push(i); }
  for (const [f, list] of [...byFile.entries()].sort()) {
    console.log(`\n${f}`);
    for (const i of list) console.log(`  ${i.sev === 'ERROR' ? '✗' : '!'} [${i.rule}] ${i.detail}`);
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Scanned ${nCity} city pages + ${nSilo} silos`);
  console.log(`ERRORS: ${errors.length}   WARNINGS: ${warns.length}`);
  if (errors.length) { console.log('\nFAILED — fix errors before publishing.'); process.exit(1); }
  console.log('\nPASS — no compliance errors.');
}

main().catch((e) => { console.error(e); process.exit(1); });
