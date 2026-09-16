# Content Uniqueness Plan — California hub-and-spoke launch

**Status:** proposal for review (no API spend yet)
**Goal:** make the ~4,300 California city × practice-area pages genuinely unique before launch, so the programmatic-SEO network reads as helpful, sourced local content — not thin templated duplication — and is safe to scale to AZ/NM afterward on the same pipeline.

---

## 1. The problem

Every city and silo page today is the **same template with `{city}`/`{state}`/`{landmark}` token swaps** (`lib/page-content.ts` → `getMergedPageConfig` → `replaceTokensInObject`). That means:

- **480 CA city pages** are byte-identical except the city name.
- **~3,800 practice silos** (city × ~8 practice areas) are byte-identical except city + practice name.
- Total exposure: **~4,300 near-duplicate pages.**

Token-swap alone is the textbook definition of thin/duplicate programmatic content. Google's Helpful Content and E-E-A-T systems will either not index most of these, or treat the whole subfolder as low quality. Launching CA at this uniqueness level risks the whole network.

## 2. Strategy — two independent layers

Uniqueness is **not** primarily a voice problem; it's a substance problem. We attack both, separately:

### Layer A — Substance (the load-bearing layer, for E-E-A-T)
Inject **real, verifiable local facts we already have in the repo** into the prose, so each page says something true that no other city's page could say:

- **Accident hub data** (`data/accident/california/<city>.json`) — real top roads, intersections, peak crash days/times, multi-year injury/fatality counts, the city's rate vs county/state. This is our strongest differentiator and it's already sourced (CCRS · data.ca.gov).
- **Location facts** — population, county, landmark, coordinates (`data/states/california-cities.json`).
- **State legal context** — statute of limitations, comparative-negligence rule, damage caps, etc. (`data/state-laws.ts`).
- **Practice-area facts** — injuries, keywords, FAQs (`lib/data/practice-areas-config.ts`).

> Substance is what makes a page non-duplicate to Google. Voice is cosmetic on its own.

### Layer B — Voice (the anti-boilerplate finish)
A small set of **voice profiles** distributed across cities so that even the templated scaffolding doesn't read from one identical mold. Voice variation reduces the "spun from one template" signal and makes the network feel human — but it is explicitly the *second* layer, never a substitute for Layer A.

## 2.5 Publish-final, then freeze (SEO-freshness strategy)

Design target is **publish-final quality, not a rough baseline.** Rationale (per the
operator's SEO experience): large content changes *after* a page is indexed tend to
hurt rankings, while small ongoing edits act as positive freshness signals. So:

- Generate **complete, index-ready** copy up front — richer/longer `about`,
  `localContext`, and FAQ for genuine depth — so there is nothing big left to change.
  This justifies **Fable 5.1 at higher effort** on the load-bearing prose; the extra
  cents buy launch-final quality.
- **Generate once per city, then freeze.** Do not mass-regenerate indexed pages.
  Post-launch changes stay small and manual (add the attorney's real reviews, light
  personalization) — each a small freshness nudge, never a disruptive rewrite.
- The regen-safety design still holds for the rare targeted fix, but the *operating
  posture* is generate-once-at-launch.

### Attorney identity is auto-populated (SB-37), not generated
When an attorney signs up they submit name / firm / bar # / address; this
**auto-populates** the city homepage + silos via the territory-assignment path
(`getLawyerForTerritory` → `LawyerTerritoryCard`), which is what satisfies **SB-37**
(the responsible attorney is identified on the page). Unrented cities render the
"territory available" state. Therefore the **generated prose stays attorney-agnostic**
— network / matching-service framing, no "we are a firm," no attorney-specific claims
— so it reads correctly whether a city is rented or not, and the attorney block owns
the SB-37 identification. Attorneys never edit the CMS; only the operator does.

## 3. What we generate vs. what stays fixed

> **Renter-owned sections.** The admin portal lets you (and the attorney renting a
> city funnel) edit **title tag, meta, hero, services, reviews, and FAQs** per city;
> those edits are saved as Supabase `location_page_configs` overrides. Generated
> content is the **uniqueness baseline that sits BELOW those overrides** (see §5), so
> a renter's edits always win and generation never clobbers them. Reviews are
> therefore **excluded from generation** — they stay renter-managed.

| Section | Treatment | Why |
|---|---|---|
| `seo.metaTitle` / `seo.metaDescription` | **Generate (unique per city)** | Duplicate title tags are a top thin-content signal; renter can still override |
| `hero.subtitle` | **Generate (voice-heavy)** | First impression; per-city hook |
| `about.longDescription` | **Generate (voice-heavy)** | Main indexable prose; weave in local facts |
| `about.commonInjuries` phrasing | **Generate (light)** | Vary wording per city |
| `whyChoose.items` | **Generate (structured)** | 3 short value props, city-aware |
| `faq.items[].answer` | **Generate (structured)** | Localize answers (e.g. cite the state SoL); renter can override in portal |
| **NEW** `localContext` | **Generate (voice-heavy)** | A short factual paragraph built from the accident-hub data (top roads, peak times) — the single most unique block per city |
| `painPoints.items` | **Generate (light)** | Reword per city |
| CTAs, form, phone, brand name | **Fixed** | Functional + brand consistency |
| `riskReversal` / disclaimers | **Fixed** | Legal-reviewed copy; do not vary |
| `testimonials` / reviews | **NOT generated — renter-owned** | Managed in the admin portal per city; on rental the attorney supplies real, permissioned reviews (see §7) |

Anything the generator omits or leaves blank automatically falls back to the existing template copy via `deepMerge` — so a partial or failed generation can never produce an empty page. Any section a renter edits in the portal wins over the generated baseline (see §5).

## 4. Voice profiles

Five profiles, assigned **deterministically per city** (stable hash of the city slug, so a city always keeps its voice), lightly biased by city size:

1. **Plain-spoken & direct** — short sentences, no jargon. (default)
2. **Warm & reassuring** — empathetic, victim-first.
3. **Authoritative & data-led** — leans on the crash stats; biased toward large metros.
4. **Community & local** — neighborhood/landmark framing; biased toward small towns.
5. **No-nonsense & urgent** — deadline/first-steps framing.

The assigned profile id is **stored in each generated JSON file** so it's visible in QA and diffs. All five share the same facts, CTAs, and compliance rules — only tone/structure vary.

## 5. Storage & wiring (committed static JSON, new cascade layer)

Generated copy is committed to the repo (versioned, diff-reviewable, no DB), as a **new override layer** in the existing `deepMerge` cascade:

```
data/content/california/<city>.json                 # city general override
data/content/california/<city>/<practice>.json      # city × practice override
```

Each file is a **partial `PageContent`** (only the generated sections) plus a `_meta` block:

```jsonc
{
  "_meta": { "voice": "authoritative-data-led", "model": "claude-fable-5-1",
             "generatedAt": "2026-09-08", "source": "accident-hub+state-laws" },
  "hero": { "subtitle": "…" },
  "about": { "longDescription": "…", "commonInjuries": ["…"] },
  "whyChoose": { "items": [ { "title": "…", "desc": "…" }, … ] },
  "localContext": { "title": "…", "body": "…" },
  "faq": { "items": [ { "question": "…", "answer": "…" } ] }
}
```

**Wiring** — add one function to `lib/page-content.ts` and merge it **above the Default/State templates but BELOW the City Override**. This mirrors the CMS scopes (Root Homepage → Default City Template → State Override → City Override): generated content is the per-city uniqueness *baseline*, and a renter's City Override (admin portal) must always win over it, while broad state/default templates must not wipe out per-city uniqueness.

```
Cascade (low → high priority), matching the CMS scopes:
  fallback → Default City Template → State Override → [GENERATED per-city JSON] → City Override (renter)
```

```ts
// reads data/content/<state>/<city>[/<practice>].json, returns partial PageContent or null
async function getStaticContentOverride(stateSlug, citySlug, practiceSlug) { … }

// inside getMergedPageConfig: merge AFTER the state overrides (steps 3–4),
// BEFORE the city general/practice overrides (steps 5–6):
const staticOverride = await getStaticContentOverride(stateSlug, citySlug, practiceSlug);
if (staticOverride) mergedSections = deepMerge(mergedSections, staticOverride);
// …then the existing City-level Supabase overrides merge on top, so renter edits win.
```

**CMS field mapping** (both editors write to Supabase `location_page_configs` / `page_config_templates`):

| CMS tab | `PageContent` key | Generated? |
|---|---|---|
| SEO & Hero → Meta Title/Description | `seo.metaTitle` / `seo.metaDescription` | ✅ unique per city |
| SEO & Hero → Hero | `hero` | ✅ (subtitle) |
| Services | `services` | ➖ template (optional light reword) |
| Pain Points | `painPoints` | ✅ light |
| Value Prop | `valueProp` | ➖ template |
| Process Steps | `howItWorks` | ➖ template |
| Reviews | `testimonials` | ❌ renter-owned, never generated |
| FAQs | `faq` | ✅ localized answers |
| (practice CMS) About & Common Injuries | `about` | ✅ voice-heavy |
| (practice CMS) Why Choose Network | `whyChoose` | ✅ structured |

**Re-generation safety:** because renter edits live in Supabase (City Override) and always merge *last*, re-running the generator — which only rewrites the committed JSON baseline — can never overwrite a saved portal edit.

Migratable later: the same JSON can be pushed into Supabase `location_page_configs` if in-CMS editing is wanted — the shape already matches.

## 6. Generation pipeline (`scripts/generate-content.ts`)

Offline batch script, Anthropic TypeScript SDK (matches the project), **tiered models**:

- **Claude Fable 5.1** (`claude-fable-5-1`, $10/$50 per MTok) — the voice-heavy sections: `hero.subtitle`, `about.longDescription`, `localContext`. Best prose/voice.
- **Claude Sonnet 5** (`claude-sonnet-5`, $2/$10 per MTok) — the structured/functional sections: `whyChoose.items`, `faq.answers`, `painPoints`. Voice matters less; big cost saving.

Cost/robustness levers (all from the current API):
- **Batch API** for the ~4,300 jobs → ~50% off, and it's non-latency-sensitive.
- **Prompt caching** — the shared system prompt + the voice-profile block are a stable cached prefix; only the per-city facts vary after the last cache breakpoint.
- **Structured outputs** (`output_config.format` with a JSON schema per section set) — returns schema-valid JSON directly. (On Fable 5.1 forced `tool_choice` is rejected, so we use structured outputs, not a forced tool, to get JSON.)
- **Fable 5.1 specifics:** thinking is always on (omit the `thinking` param); run at **`effort: "low"`/`"medium"`** — this is short marketing prose, not hard reasoning; enable **refusal fallbacks by default** (`fallbacks: "default"`).

**Per-job inputs:** city facts + accident-hub JSON (top 3 roads, peak day/window, latest-year injuries/fatalities, rate-vs-state) + state-law facts + practice-area facts + assigned voice profile.

### System prompt (shared, cached)
```
You are writing website copy for LawProactive, a service that connects people injured
in accidents with independent personal-injury attorneys in their area. You are NOT a
law firm and do not employ the attorneys.

Write in the assigned VOICE. Ground every location-specific claim ONLY in the FACTS
block provided — never invent roads, statistics, courts, attorneys, case results, or
settlement amounts. If a fact isn't provided, write around it.

Hard rules (California SB-37 + legal-advertising compliance):
- No guarantees or predictions of outcome, and no promised or implied settlement/verdict amounts.
- No superlatives about the attorneys ("best", "top-rated") and no claims of a specific
  attorney or firm — the site is a matching service.
- Crash data describes REPORTED public-record collisions, not danger verdicts about a road.
- Keep it factual, useful, and locally specific. American English.

Return ONLY JSON matching the provided schema. No preamble.
```

### Per-section user prompt (template)
```
VOICE: {{voiceProfile.name}} — {{voiceProfile.guidance}}

CITY FACTS:
- City: {{city}}, {{county}} County, California  (pop. {{population}})
- Landmark: {{landmark}}
PRACTICE (if silo): {{practiceName}} — common injuries: {{injuries}}
STATE LAW: statute of limitations {{sol}}; {{negligenceRule}}; {{damageCaps}}
CRASH DATA ({{span}}, CCRS via data.ca.gov):
- Most collisions reported on {{peakDay}}, around {{peakWindow}}
- Highest-collision roads: {{topRoads}}
- Latest finalized year {{year}}: {{injuries}} injuries, {{fatalities}} fatalities;
  injury rate {{rate}}/100k vs state {{stateRate}}/100k

Write these sections for this page: {{sectionList}}.
{{perSectionLengthAndStyleNotes}}
```

## 7. Compliance guardrails (must-haves)

- **SB-37 / legal advertising** is enforced in the system prompt (above): no outcome guarantees, no settlement figures, no attorney superlatives, matching-service framing, crash data framed as reported public record.
- **No fabrication** — the model may only use facts in the FACTS block. This is why we feed real accident-hub data rather than letting it invent local color.
- **Reviews are renter-managed; default placeholders must be clean.** On rental, the attorney supplies real, permissioned reviews via the admin portal (e.g. Victorville → Andre), which override the default. But **unrented city pages rank publicly with the default placeholder reviews** until someone rents them — that's the pages you're using to attract renters. Today `getHardcodedFallbackConfig().testimonials` ships invented client names + specific settlement dollar amounts, which is an FTC endorsement-guide / state-bar advertising risk on every unrented, indexed page. **Recommendation:** change the *default* placeholders to non-fabricated, illustrative/aggregate wording (no invented names, no dollar figures) — e.g. "Clients we've connected have recovered compensation for medical bills, lost wages, and pain and suffering." Renters still overwrite them with real reviews on rental. Small edit to the template default; the per-city admin flow is untouched. (Once real reviews are in, specific settlement amounts may still need substantiation/disclaimers under the renter's state bar rules — that's the renter's ad compliance, surfaced here for awareness.)

## 8. Dedup / QA harness (`scripts/check-content-dup.ts`)

Before anything ships, measure uniqueness objectively:

- **Near-duplicate detector** — n-gram shingling + Jaccard/MinHash similarity across all generated pages; **flag any pair above a threshold** (e.g. 0.7) and fail the launch gate until resolved. Also compares against the *template* to ensure each page diverges enough from the base.
- **Voice preview** — extend the existing interactive artifact so you can pick a city and see its rendered copy + which voice profile it drew, to eyeball tone across cities.
- **Gate:** no page ships above the similarity threshold; a sample is human-read per voice profile.

## 9. Cost estimate (rough, full CA run)

Assumptions: ~4,300 pages; ~1,200 output tokens of new prose/page (≈60% Fable, 40% Sonnet); ~800 unique input tokens/page (shared system prompt cached); Batch API (−50%).

| | Output | Input | Subtotal (batched) |
|---|---|---|---|
| Fable 5.1 (voice) | ~3.1M @ $50 | ~2.1M @ $10 | ~$88 |
| Sonnet 5 (functional) | ~2.1M @ $10 | ~1.4M @ $2 | ~$12 |
| **Total** | | | **~$100 (order-of-magnitude; ~$100–200 with retries/QA reruns)** |

Cheap enough that a **1-city prototype first** (next step) to lock quality/voice costs cents.

## 10. Sequencing

1. **This doc** → your review/edits.
2. **Prototype**: build the pipeline + generate **one city (Downey) across all silos**, 2 voice profiles; you review real output + cost.
3. Tune prompts/voices; wire `getStaticContentOverride` into the cascade.
4. **Batch-generate all CA**; run the dedup gate; human-sample per voice.
5. Launch CA.
6. **AZ/NM**: same pipeline — just needs their accident data + city lists loaded first.

---

### Recommendations (updated after the rental-model clarification)
1. **Voice** — recommend **one consistent brand voice** with variation coming from real local facts + structural variety (which fact leads, section order), not five personalities. Voice-swapping doesn't move Google (it dedupes on substance) and fragments a trust-dependent brand. Can A/B a second register in the prototype.
2. **`localContext`** — recommend **yes**, add it to city + silo pages: highest-uniqueness, fully-sourced, near-zero compliance risk.
3. **Default placeholder reviews** — recommend a **small template edit now** to remove invented names/settlement figures (illustrative/aggregate wording), since unrented indexed pages show them publicly; renters still overwrite with real reviews via the portal. Generation does not touch reviews.
4. **Cascade ordering** — generated JSON merges as the uniqueness baseline **below** the Supabase admin/renter overrides, so renter portal edits always win.
