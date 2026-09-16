/**
 * Per-city fact extraction for silo content generation.
 * Reads the committed crash data at data/accident/california/<slug>.json and
 * produces an accurate, human-readable fact block for the generation prompt.
 * No network, no DB — pure file read.
 */
import { promises as fs } from 'fs';
import path from 'path';

const DOW = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface CityFacts {
  slug: string;
  city: string;
  county: string;
  population: number | null;
  latestFinalYear: number | null;
  injuryCrashes: number | null;
  injuries: number | null;
  fatalities: number | null;
  peakDay: string | null;
  peakWindow: string | null;
  topRoads: string[];
  factBlock: string; // formatted for the prompt
}

const ABBR: Record<string, string> = {
  BL: 'Boulevard', BLVD: 'Boulevard', AV: 'Avenue', AVE: 'Avenue', RD: 'Road',
  ST: 'Street', DR: 'Drive', LN: 'Lane', HWY: 'Highway', CT: 'Court',
  PKWY: 'Parkway', WY: 'Way', PL: 'Place', TER: 'Terrace', CIR: 'Circle',
};

function cleanRoad(s: string): string {
  let r = s.replace(/\s*[NSEW]\/B\b/g, ''); // drop direction (N/B, S/B, ...)
  r = r.replace(/\s+/g, ' ').trim();
  return r
    .split(' ')
    .map((w) => {
      const u = w.toUpperCase().replace(/[(),]/g, '');
      if (/^(I|US|SR|CA)-\d+$/.test(u)) return u; // keep highway tokens: US-101, I-5, SR-99
      if (ABBR[u]) return ABBR[u];
      // preserve parentheses around freeway names, title-case the inside
      if (w.startsWith('(')) return '(' + w.slice(1).charAt(0).toUpperCase() + w.slice(2).toLowerCase();
      if (w.endsWith(')')) return w.slice(0, -1).charAt(0).toUpperCase() + w.slice(1, -1).toLowerCase() + ')';
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

function hourLabel(h: number): string {
  const ap = h < 12 ? 'a.m.' : 'p.m.';
  const hr = h % 12 || 12;
  return `${hr} ${ap}`;
}

export async function loadFacts(slug: string, dataDir: string): Promise<CityFacts> {
  const raw = await fs.readFile(path.join(dataDir, `${slug}.json`), 'utf-8');
  const d = JSON.parse(raw);
  const finals = (d.cityYears ?? []).filter((y: any) => y.status === 'final');
  const ly = finals.length ? finals[finals.length - 1] : (d.cityYears ?? [])[d.cityYears.length - 1] ?? null;

  const dow: number[] = d.peak?.dow ?? [];
  const hrs: number[] = d.peak?.hours ?? [];
  const peakDay = dow.length ? DOW[dow.indexOf(Math.max(...dow))] : null;
  const peakHour = hrs.length ? hrs.indexOf(Math.max(...hrs)) : null;
  const peakWindow = peakHour !== null ? `${hourLabel(peakHour)}–${hourLabel((peakHour + 2) % 24)}` : null;

  const seen = new Set<string>();
  const topRoads: string[] = [];
  for (const r of d.topRoads ?? []) {
    const c = cleanRoad(r.road);
    const key = c.replace(/\(.*?\)/g, '').trim();
    if (seen.has(key)) continue;
    seen.add(key);
    topRoads.push(c);
  }

  const facts: CityFacts = {
    slug,
    city: d.city,
    county: d.county,
    population: d.population ?? null,
    latestFinalYear: ly?.year ?? null,
    injuryCrashes: ly?.injuryCrashes ?? null,
    injuries: ly?.injuries ?? null,
    fatalities: ly?.fatalities ?? null,
    peakDay,
    peakWindow,
    topRoads: topRoads.slice(0, 4),
    factBlock: '',
  };

  facts.factBlock = [
    `City: ${facts.city}, California`,
    `County: ${facts.county} County`,
    facts.population ? `Population: ${facts.population.toLocaleString('en-US')}` : '',
    ly
      ? `Most recent FINAL crash year (${facts.latestFinalYear}): ${facts.injuryCrashes?.toLocaleString('en-US')} injury collisions, ${facts.injuries?.toLocaleString('en-US')} people injured, ${facts.fatalities} traffic deaths.`
      : '',
    facts.peakDay ? `Reported crashes tend to peak on ${facts.peakDay}s around ${facts.peakWindow}.` : '',
    facts.topRoads.length ? `Highest-volume corridors (public-record collision counts): ${facts.topRoads.join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return facts;
}
