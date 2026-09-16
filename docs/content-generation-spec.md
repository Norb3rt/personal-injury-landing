# LawProactive — Unique Content Generation Spec (California hub-and-spoke)

Give this to Claude (Fable 5.1) to generate genuinely unique, SB-37-compliant copy
for each California city funnel: **1 city page + 6 practice silos per city.**

Content is stored as committed static JSON and merged into the page config **below**
CMS/city overrides, so anything the renter later edits in the CMS wins. Generate once
and freeze (big post-index changes hurt SEO; small edits help).

---

## File layout & naming

- City page:    `data/content/california/<city-slug>.json`
- Practice silo: `data/content/california/<city-slug>/<practice-slug>.json`

`<city-slug>` matches the site's routing slug (lowercase, hyphenated). The six practice slugs are exactly:

```
car-accident
slip-and-fall
medical-malpractice
workplace-injury
product-liability
wrongful-death
```

---

## Schema 1 — City page  (`<city-slug>.json`)

```json
{
  "_meta": { "voice": "brand-standard", "model": "claude-fable-5-1", "generatedAt": "YYYY-MM-DD", "source": "accident-hub + state-laws + city facts", "note": "" },
  "seo": {
    "metaTitle": "<= 60 chars. Pattern: '<City>, CA Personal Injury Lawyer | Free Case Review'",
    "metaDescription": "<= 155 chars. Include county, '2 years to file', 'no fee unless you win'."
  },
  "hero": { "subtitle": "1-2 sentences: injury types + connect free + serving <County>." },
  "about": {
    "title": "Personal Injury Help in <City>, California",
    "longDescription": "150-220 words. Weave in real local roads, one landmark, and the crash stats. State plainly that LawProactive is a free service that connects people with an independent attorney and is NOT a law firm; no fee unless recovery.",
    "commonInjuriesTitle": "short heading",
    "commonInjuries": ["6 short bullet strings"],
    "ctaText": "short CTA, no guarantee"
  },
  "whyChoose": {
    "title": "short heading",
    "items": [
      { "title": "short", "desc": "1-2 sentences" }
    ]
  },
  "painPoints": { "items": ["4 short strings — an injured person's real worries"] },
  "faq": {
    "items": [
      { "question": "...", "answer": "2-4 sentences" }
    ]
  }
}
```
- `whyChoose.items`: **4** items, each anchored to a real California-law fact.
- `faq.items`: **5** items. One FAQ may reference the local crash corridors as neutral public-record counts.

## Schema 2 — Practice silo  (`<city-slug>/<practice-slug>.json`)

```json
{
  "_meta": { "voice": "brand-standard", "model": "claude-fable-5-1", "generatedAt": "YYYY-MM-DD", "practice": "<practice-slug>", "note": "" },
  "seo": { "metaTitle": "<= 60 chars, practice + city", "metaDescription": "<= 155 chars" },
  "hero": { "subtitle": "1-2 sentences, practice-specific" },
  "about": {
    "title": "<City> <Practice> Claims",
    "longDescription": "120-180 words, practice + city specific",
    "commonInjuriesTitle": "short heading",
    "commonInjuries": ["6 short bullet strings"],
    "ctaText": "short CTA"
  },
  "whyChoose": {
    "title": "short heading",
    "items": [
      { "title": "short", "desc": "1-2 sentences" }
    ]
  },
  "faq": {
    "items": [
      { "question": "...", "answer": "2-4 sentences" }
    ]
  }
}
```
- `whyChoose.items`: **3** items.  `faq.items`: **3** items.

---

## Per-city facts to inject (source of truth: `data/accident/california/<city>.json`)

- Population
- County
- 3-5 top roads / corridors
- One recognizable landmark
- Latest FINAL-year injury-crash count + people injured
- Peak day / time window

---

## Hard rules — non-negotiable (SB-37 + safety)

1. **No attorney identity anywhere** — no names, firm names, bar numbers, addresses.
   These auto-populate from the renter's signup form (this is what makes each live page SB-37 compliant).
2. **No reviews / testimonials** — renter-managed in the CMS; do not generate.
3. **No outcome guarantees, no settlement or verdict dollar figures, no "best / #1 / top-rated"** claims.
4. **Crash statistics are neutral public-record counts only** — never "most dangerous road,"
   never a danger verdict about any location.
5. LawProactive is **a free service that connects injured people with an independent attorney — NOT a law firm.**
6. **California law must be accurate:** 2-year statute of limitations (shorter, sometimes ~6 months, against
   government entities); pure comparative fault; no cap on non-economic damages in ordinary PI cases
   (the MICRA cap applies only to medical malpractice, and it rises annually).

## Voice
Plain-spoken, victim-first, calm and reassuring. No hype, no fear-mongering, no legalese dumps.
Vary sentence openings and structure city-to-city so no two pages read from a template.

## Output
Return each file as strict JSON (UTF-8, no BOM, no trailing commas, no comments in the JSON body —
put notes in `_meta.note`). One JSON object per file, matching the schema above exactly.
