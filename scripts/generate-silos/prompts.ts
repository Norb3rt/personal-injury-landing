/**
 * Prompt + schema for silo content generation (Fable 5.1).
 * The schema is enforced via structured outputs; the prompts carry the brand
 * voice, the SB-37 guardrails, and a per-practice California-law anchor.
 */
// Use the zod/v4 surface (shipped in zod 3.25) — the Anthropic SDK's
// zodOutputFormat helper builds its JSON schema via zod/v4 internals.
import { z } from 'zod/v4';
import type { CityFacts } from './facts';

export const PRACTICES = [
  'car-accident',
  'slip-and-fall',
  'medical-malpractice',
  'workplace-injury',
  'product-liability',
  'wrongful-death',
] as const;
export type Practice = (typeof PRACTICES)[number];

export const PRACTICE_LABEL: Record<Practice, string> = {
  'car-accident': 'Car Accident',
  'slip-and-fall': 'Slip & Fall / Premises Liability',
  'medical-malpractice': 'Medical Malpractice',
  'workplace-injury': 'Workplace Injury',
  'product-liability': 'Product Liability',
  'wrongful-death': 'Wrongful Death',
};

// California-law anchor per practice — keeps generated copy legally accurate.
export const PRACTICE_LAW: Record<Practice, string> = {
  'car-accident':
    'California: 2-year statute of limitations (shorter, sometimes 6 months, against a government entity); pure comparative fault; no cap on non-economic damages; contingency fees. Emphasize preserving evidence and not giving the other insurer a recorded statement.',
  'slip-and-fall':
    'California premises liability: the injured person generally must show the owner knew or should have known of the hazard and failed to fix/warn ("notice"). 2-year deadline (shorter vs. a public entity); pure comparative fault. Emphasize documenting the hazard and preserving surveillance video.',
  'medical-malpractice':
    'California MICRA: generally 1 year from discovery and no more than 3 years from the injury; 90-day pre-suit notice; a statutory cap on NON-economic damages that RISES each year; a qualified medical expert is almost always required. A bad outcome alone is not malpractice.',
  'workplace-injury':
    "California: workers' compensation is usually the exclusive remedy against the employer regardless of fault, but a negligent THIRD PARTY (subcontractor, property owner, equipment maker, another driver) can support a separate injury claim. Report to employer within 30 days; retaliation is illegal; third-party claims carry the 2-year deadline.",
  'product-liability':
    'California product liability often runs on STRICT liability — the injured person generally need only show the product was defective (design, manufacturing, or warning defect) and that it caused the injury, not that the maker was negligent. Preserve the product itself; manufacturers, distributors and retailers may all be liable.',
  'wrongful-death':
    'California wrongful death: standing is limited (spouse/domestic partner and children first; then certain dependents/heirs); 2-year deadline from the date of death (shorter vs. a government entity); recoverable losses include funeral/burial costs, lost financial support, and loss of love, companionship and guidance. It is a civil action, separate from any criminal case. Write with empathy.',
};

// Silo content schema (structured output). _meta is added at write time.
export const SiloSchema = z.object({
  seo: z.object({
    metaTitle: z.string().describe('<= 60 characters, includes the practice and city'),
    metaDescription: z.string().describe('<= 155 characters'),
  }),
  hero: z.object({
    subtitle: z.string().describe('1-2 sentences, practice + city specific'),
  }),
  about: z.object({
    title: z.string().describe('e.g. "<City> <Practice> Claims"'),
    longDescription: z.string().describe('120-180 words, practice + city specific prose'),
    commonInjuriesTitle: z.string(),
    commonInjuries: z.array(z.string()).describe('exactly 6 short bullet strings'),
    ctaText: z.string().describe('short CTA, no guarantee'),
  }),
  whyChoose: z.object({
    title: z.string(),
    items: z
      .array(z.object({ title: z.string(), desc: z.string().describe('1-2 sentences') }))
      .describe('exactly 3 items'),
  }),
  faq: z.object({
    items: z
      .array(z.object({ question: z.string(), answer: z.string().describe('2-4 sentences') }))
      .describe('exactly 3 items'),
  }),
});
export type Silo = z.infer<typeof SiloSchema>;

export const SYSTEM_PROMPT = `You write website copy for LawProactive, a free service that connects injured people with an independent personal injury attorney. You are NOT a law firm. You produce one landing page for one California city at a time (either a general personal-injury city page or a single practice-area page).

VOICE: plain-spoken, calm, victim-first, and reassuring. No hype, no fear-mongering, no legalese dumps. Vary your sentence openings, rhythm and structure so that no two cities read from the same template — this copy must be genuinely unique per city to avoid duplicate-content penalties.

HARD RULES (non-negotiable):
- Never name or invent an attorney, law firm, bar number, address, phone number, or years of experience. Attorney identity is added elsewhere.
- Never fabricate reviews, testimonials, ratings, or client names.
- Never promise or guarantee an outcome. Never state or imply a settlement or verdict dollar amount. Never say "best", "#1", "top-rated", or similar.
- Treat all crash statistics as neutral public-record counts. Never call any road, intersection, or area "dangerous" or "the most dangerous"; never render a danger verdict about a place.
- Always be accurate about California law as given in the LAW ANCHOR.
- LawProactive is a free connection service, not a law firm; attorneys in the network work on contingency (no fee unless there is a recovery).

Return ONLY the structured object requested — no preamble, no markdown.`;

// ── City page (general personal injury overview for the whole city) ──
export const CityPageSchema = z.object({
  seo: z.object({
    metaTitle: z.string().describe('<= 60 characters, e.g. "<City>, CA Personal Injury Lawyer | Free Case Review"'),
    metaDescription: z.string().describe('<= 155 characters; include county, "2 years to file", "no fee unless you win"'),
  }),
  hero: z.object({
    subtitle: z.string().describe('1-2 sentences: injury types + connect free + serving <County> County'),
  }),
  about: z.object({
    title: z.string().describe('e.g. "Personal Injury Help in <City>, California"'),
    longDescription: z.string().describe('150-220 words weaving in the real local roads, one landmark if known, and the crash stats; must state LawProactive is a free service and NOT a law firm, no fee unless recovery'),
    commonInjuriesTitle: z.string(),
    commonInjuries: z.array(z.string()).describe('exactly 6 short bullet strings'),
    ctaText: z.string().describe('short CTA, no guarantee'),
  }),
  whyChoose: z.object({
    title: z.string(),
    items: z
      .array(z.object({ title: z.string(), desc: z.string().describe('1-2 sentences') }))
      .describe('exactly 4 items, each anchored to a real California-law fact'),
  }),
  painPoints: z.object({
    items: z.array(z.string()).describe("exactly 4 short strings — an injured person's real worries"),
  }),
  faq: z.object({
    items: z
      .array(z.object({ question: z.string(), answer: z.string().describe('2-4 sentences') }))
      .describe('exactly 5 items'),
  }),
});
export type CityPage = z.infer<typeof CityPageSchema>;

const CITY_LAW =
  'California: 2-year statute of limitations for most injury claims (shorter — sometimes 6 months — against a government entity); pure comparative fault (partial fault reduces but does not bar recovery); no cap on non-economic damages in ordinary injury cases; attorneys work on contingency (no fee unless there is a recovery).';

export function buildCityUserPrompt(facts: CityFacts): string {
  return `Write the general Personal Injury city page for ${facts.city}, California.

CITY FACTS (use the real, specific details — roads, county, counts — to anchor the copy to THIS city; do not invent facts not given here, and if a fact is missing, omit it rather than guess):
${facts.factBlock}

CALIFORNIA LAW to reflect accurately:
${CITY_LAW}

REQUIREMENTS:
- seo.metaTitle <= 60 chars; seo.metaDescription <= 155 chars.
- hero.subtitle: 1-2 sentences naming a couple of injury types and that the connection is free, serving ${facts.county} County.
- about.longDescription: 150-220 words specific to ${facts.city} — reference its real corridors and crash counts from the facts, and state plainly that LawProactive is a free service that connects people with an independent attorney and is NOT a law firm.
- about.commonInjuries: exactly 6 short items.
- whyChoose.items: exactly 4 items, each grounded in the California law above.
- painPoints.items: exactly 4 short worries an injured person has.
- faq.items: exactly 5 questions with 2-4 sentence answers; one FAQ should mention where crashes cluster in ${facts.city} framed strictly as neutral public-record counts (never call a road "dangerous").
- Vary phrasing so this reads differently from any other city. Do not reuse stock sentences.`;
}

export function buildUserPrompt(facts: CityFacts, practice: Practice): string {
  return `Write the ${PRACTICE_LABEL[practice]} silo page for ${facts.city}, California.

CITY FACTS (use the real, specific details — roads, county, counts — to anchor the copy to THIS city; do not invent facts not given here, and if a fact is missing, simply omit it):
${facts.factBlock}

LAW ANCHOR for this practice:
${PRACTICE_LAW[practice]}

REQUIREMENTS:
- seo.metaTitle <= 60 chars; seo.metaDescription <= 155 chars.
- hero.subtitle: 1-2 sentences specific to ${PRACTICE_LABEL[practice]} in ${facts.city}.
- about.longDescription: 120-180 words, specific to this practice and city.
- about.commonInjuries: exactly 6 short items appropriate to this practice.
- whyChoose.items: exactly 3 items, each grounded in the LAW ANCHOR.
- faq.items: exactly 3 realistic questions with 2-4 sentence answers; at least one FAQ should feel specific to ${facts.city}.
- Vary phrasing from how any other city would read. Do not reuse stock sentences.`;
}
