# Content generation pipeline (Claude Fable 5.1 + Batch API)

Generates unique, SB-37-compliant JSON for the California funnels:

- **City pages** → `data/content/california/<slug>.json`
- **6 practice-area silos** per city → `data/content/california/<slug>/<practice>.json`

Pick what to generate with `--kind city|silo|both` (default `both`). Everything it
writes merges *below* CMS/city overrides (see `lib/page-content.ts`), so a
renter's later edits always win. A handful of flagship city pages are
hand-authored and committed; the pipeline skips anything that already exists
unless you pass `--overwrite`.

## Prerequisites

1. **SDK** (already added as a devDependency): `@anthropic-ai/sdk`. If a fresh
   checkout is missing it: `npm install`.
2. **Auth** — set the console API key:
   - **Cloud (Claude Code web) environments: use `PIPELINE_API_KEY`.**
     These environments deliberately strip `ANTHROPIC_API_KEY` ("won't be used to
     authenticate requests — sessions are authenticated through your Anthropic
     account"), so that name silently will not work. Put
     `PIPELINE_API_KEY=sk-ant-...` in the environment's Environment variables box.
   - **Local runs:** `export ANTHROPIC_API_KEY=sk-ant-...` (or `PIPELINE_API_KEY`).

   Verify either way with:
   ```bash
   npx tsx scripts/generate-silos/index.ts test
   ```
   It makes one minimal request and reports the key source, length, and a specific
   reason on failure (truncated key / retention / billing). Costs a fraction of a cent.
3. **Data retention** — Fable 5.1 requires standard (30-day) data retention on
   your Anthropic org. Zero-data-retention orgs get a 400. If so, run with a
   different `--model` (e.g. `claude-sonnet-5`) or ask Anthropic to enable it.

> The console.anthropic.com account that owns the API key is separate from your
> claude.ai login.

## Commands

```bash
# See progress (no API calls) — city-page and silo counts
npx tsx scripts/generate-silos/index.ts list

# Inspect the exact prompts (no API calls, no spend)
npx tsx scripts/generate-silos/index.ts prompts downey city
npx tsx scripts/generate-silos/index.ts prompts downey car-accident

# Cost-check a run without submitting
npx tsx scripts/generate-silos/index.ts submit --limit 25 --dry-run

# Submit a batch (biggest cities first) — city pages + silos. Prints a batch id.
npx tsx scripts/generate-silos/index.ts submit --limit 25

# Just city pages, or just silos:
npx tsx scripts/generate-silos/index.ts submit --kind city
npx tsx scripts/generate-silos/index.ts submit --kind silo --limit 50

# Watch it, then write the files when done
npx tsx scripts/generate-silos/index.ts status <batchId>
npx tsx scripts/generate-silos/index.ts fetch  <batchId>
```

### submit options

| flag | meaning |
|------|---------|
| `--kind` | `city`, `silo`, or `both` (default `both`) |
| `--limit N` | only the N largest cities (by population) |
| `--only a,b,c` | only these city slugs |
| `--practices x,y` | only these practices (default: all 6; ignored for `--kind city`) |
| `--overwrite` | regenerate pages that already exist (default: skip) |
| `--model ID` | model override (default `claude-fable-5-1`; use `claude-sonnet-5` to test cheaply) |
| `--dry-run` | build + estimate cost, do not submit |

## Suggested first run

```bash
# 1. Trial the voice cheaply on a few cities (city + silos), then eyeball output
npx tsx scripts/generate-silos/index.ts submit --limit 5 --dry-run
npx tsx scripts/generate-silos/index.ts submit --limit 5           # then fetch

# 2. Replace the placeholder templated silos on the first 4 cities with Fable copy
npx tsx scripts/generate-silos/index.ts submit \
  --kind silo --only los-angeles,san-diego,san-jose,downey --overwrite

# 3. Roll forward in waves, biggest first (skips the hand-written city pages)
npx tsx scripts/generate-silos/index.ts submit --limit 100
```

## Cost

Fable 5.1 is $10 / $50 per MTok; the **Batch API is 50% off**. A page is roughly
700 input + ~1,100 output tokens. Full coverage is ~545 city pages + ~3,270
silos ≈ 3,800 pages — low-hundreds of dollars at Fable rates (the `submit`
command prints an estimate before you commit). `--model claude-sonnet-5` is
~5× cheaper if you want to trial voice first.

## Retries

`fetch` writes any refusals/errors to `.batches/<id>.failures.json` and prints a
ready-to-run `submit --only … --overwrite` for just those cities.

## How it works

- `facts.ts` — reads `data/accident/california/<slug>.json` and builds an
  accurate per-city fact block (population, county, latest final-year crash
  counts, peak day/window, cleaned top corridors).
- `prompts.ts` — the brand voice + SB-37 hard rules (system), a per-practice
  California-law anchor, and the structured-output schema (enforced, so every
  result is valid JSON in the exact shape the site renders).
- `index.ts` — selects targets, submits the Batch, and writes validated results.
