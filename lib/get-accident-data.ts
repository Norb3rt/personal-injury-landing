import { promises as fs } from 'fs'
import path from 'path'
import { supabaseServer } from '@/lib/supabase-server'
import { StateDataLoader } from '@/lib/data/state-loader'

/**
 * Server-side reader for the SWITRS accident-data hub.
 *
 * Reads the rollup tables created by supabase/migrations/0001_switrs_accident_data.sql
 * (populated by supabase/etl_switrs.py) and maps the snake_case DB columns to the
 * camelCase keys that components/accident-data-hub.tsx renders.
 *
 * Rates are NEVER stored — they are derived at render from injuries|fatalities /
 * population. Only `population` and `status` are external to the SWITRS aggregation.
 *
 * Returns `null` when the city has no `city_year` rows (no data loaded yet, or a
 * non-California city — SWITRS is California-only). The city page falls back to the
 * modeled estimate (`data/accident-stats.ts`) in that case.
 */

export interface FI {
  f: number
  i: number
}

export interface CityYear {
  year: number
  population: number | null
  fatalCrashes: number
  injuryCrashes: number
  fatalities: number
  injuries: number
  seriousInjuries: number
  status: 'final' | 'prov' | 'partial'
  // road-user classes
  occupant: FI
  pedestrian: FI
  bicyclist: FI
  motorcyclist: FI
  truck: FI
  olderAdult: FI
  unrestrained: FI
  // contributing factors
  alcohol: FI
  drug: FI
  distracted: FI
  speeding: FI
}

export interface BenchYear {
  year: number
  population: number | null
  injuries: number
  fatalities: number
}

export interface TimeBucket {
  bucket: number
  crashes: number
  injuries: number
  fatalities: number
}

export interface RoadRow {
  rank: number
  road: string
  crashes: number
  injuries: number
  fatalities: number
}

export interface IntersectionRow {
  rank: number
  intersection: string
  crashes: number
  injuries: number
  fatalities: number
}

export interface AccidentData {
  city: string
  county: string
  state: string
  stateAbbr: string
  source?: string                         // e.g. "CCRS · data.ca.gov + CA population"
  years: CityYear[]                       // ascending by year
  county_benchmark: Record<number, BenchYear>
  state_benchmark: Record<number, BenchYear>
  timeProfile: {
    span: string | null
    hours: TimeBucket[]                   // bucket 0-23
    dow: TimeBucket[]                     // bucket 1=Mon .. 7=Sun
  }
  topRoads: RoadRow[]
  topIntersections: IntersectionRow[]
}

const num = (v: unknown): number => (typeof v === 'number' ? v : Number(v) || 0)
const pair = (r: any, base: string): FI => ({ f: num(r[`${base}_f`]), i: num(r[`${base}_i`]) })

function mapCityYear(r: any): CityYear {
  return {
    year: num(r.year),
    population: r.population == null ? null : num(r.population),
    fatalCrashes: num(r.fatal_crashes),
    injuryCrashes: num(r.injury_crashes),
    fatalities: num(r.fatalities),
    injuries: num(r.injuries),
    seriousInjuries: num(r.serious_injuries),
    status: r.status === 'prov' ? 'prov' : r.status === 'partial' ? 'partial' : 'final',
    occupant: pair(r, 'occupant'),
    pedestrian: pair(r, 'ped'),
    bicyclist: pair(r, 'bike'),
    motorcyclist: pair(r, 'moto'),
    truck: pair(r, 'truck'),
    olderAdult: pair(r, 'older'),
    unrestrained: pair(r, 'unrestrained'),
    alcohol: pair(r, 'alcohol'),
    drug: pair(r, 'drug'),
    distracted: pair(r, 'distracted'),
    speeding: pair(r, 'speeding'),
  }
}

function benchIndex(rows: any[] | null): Record<number, BenchYear> {
  const out: Record<number, BenchYear> = {}
  for (const r of rows ?? []) {
    const year = num(r.year)
    out[year] = {
      year,
      population: r.population == null ? null : num(r.population),
      injuries: num(r.injuries),
      fatalities: num(r.fatalities),
    }
  }
  return out
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const STATE_NAMES: Record<string, string> = {
  CA: 'California', TX: 'Texas', FL: 'Florida', NY: 'New York', AZ: 'Arizona',
}

/**
 * Canonical per-city file shape emitted by the data pipeline (see
 * data/accident/california/downey.json — the render-shape contract). Committed
 * files use THIS shape; the loader adapts it to AccidentData for the component.
 */
interface RawCityFile {
  city: string
  county: string
  state: string          // abbreviation, e.g. "CA"
  source?: string
  cityYears: Array<Record<string, any>>
  countyYears: Array<{ year: number; population: number; injuries: number; fatalities: number }>
  stateYears: Array<{ year: number; population: number; injuries: number; fatalities: number }>
  peak?: { hours?: number[]; dow?: number[] }
  topRoads?: Array<{ road: string; crashes?: number; injuries: number; fatalities: number }>
  topIntersections?: Array<{ intersection: string; crashes?: number; injuries: number; fatalities: number }>
}

const fiOf = (v: any): FI => ({ f: num(v?.f), i: num(v?.i) })
// Pipeline emits road/intersection names in ALL CAPS — title-case for display,
// then restore highway/route designators that should stay uppercase (US-101,
// SR-91, CA-1, I-5, and direction codes like S/B, N/B).
const titleCase = (s: string) =>
  (s || '')
    .replace(/\b[a-zA-Z]+\b/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/\b(Us|Sr|Ca|Sb|Nb|Eb|Wb)\b/g, (w) => w.toUpperCase())
const asStatus = (s: any): CityYear['status'] =>
  s === 'prov' ? 'prov' : s === 'partial' ? 'partial' : 'final'

/** Adapt the canonical per-city file into the component's AccidentData shape. */
function adaptRawCity(raw: RawCityFile): AccidentData {
  const years: CityYear[] = (raw.cityYears ?? []).map((r) => ({
    year: num(r.year),
    population: r.population == null ? null : num(r.population),
    fatalCrashes: num(r.fatalCrashes),
    injuryCrashes: num(r.injuryCrashes),
    fatalities: num(r.fatalities),
    injuries: num(r.injuries),
    seriousInjuries: num(r.seriousInjuries),
    status: asStatus(r.status),
    occupant: fiOf(r.occupant),
    pedestrian: fiOf(r.pedestrian),
    bicyclist: fiOf(r.bicyclist),
    motorcyclist: fiOf(r.motorcyclist),
    truck: fiOf(r.truck),
    olderAdult: fiOf(r.olderAdult),
    unrestrained: fiOf(r.unrestrained),
    alcohol: fiOf(r.alcohol),
    drug: fiOf(r.drug),
    distracted: fiOf(r.distracted),
    speeding: fiOf(r.speeding),
  })).sort((a, b) => a.year - b.year)

  const county_benchmark = benchIndex(raw.countyYears as any[])
  const state_benchmark = benchIndex(raw.stateYears as any[])

  const hours: TimeBucket[] = (raw.peak?.hours ?? []).map((c, i) => ({
    bucket: i, crashes: num(c), injuries: 0, fatalities: 0,
  }))
  const dow: TimeBucket[] = (raw.peak?.dow ?? []).map((c, i) => ({
    bucket: i + 1, crashes: num(c), injuries: 0, fatalities: 0,
  }))

  // Multi-year span label from the finalized years actually shown (>= 2020).
  const shown = years.filter((y) => y.status === 'final' && y.year >= 2020).map((y) => y.year)
  const span = shown.length ? `${Math.min(...shown)}–${Math.max(...shown)}` : null

  const stateAbbr = raw.state || ''
  const state = STATE_NAMES[stateAbbr] || stateAbbr

  return {
    city: raw.city,
    county: raw.county && raw.county !== 'null' ? raw.county : '',
    state,
    stateAbbr,
    source: raw.source,
    years,
    county_benchmark,
    state_benchmark,
    timeProfile: { span, hours, dow },
    topRoads: (raw.topRoads ?? []).map((r, i) => ({
      rank: i + 1, road: titleCase(r.road), crashes: num(r.crashes), injuries: num(r.injuries), fatalities: num(r.fatalities),
    })),
    topIntersections: (raw.topIntersections ?? []).map((r, i) => ({
      rank: i + 1, intersection: titleCase(r.intersection), crashes: num(r.crashes), injuries: num(r.injuries), fatalities: num(r.fatalities),
    })),
  }
}

/**
 * Read a committed static per-city file, if one exists, and adapt it.
 * Path: data/accident/<stateSlug>/<citySlug>.json — the canonical pipeline shape.
 * This is the no-database path: real aggregates live in the repo and render at
 * build time, exactly like data/states/*.json. Returns null when absent/empty.
 */
async function readStaticAccidentData(
  stateSlug: string,
  citySlug: string,
): Promise<AccidentData | null> {
  try {
    const file = path.join(process.cwd(), 'data', 'accident', stateSlug.toLowerCase(), `${citySlug}.json`)
    const raw = JSON.parse((await fs.readFile(file, 'utf-8')).replace(/^﻿/, '')) as RawCityFile
    if (!raw?.cityYears?.length) return null
    return adaptRawCity(raw)
  } catch {
    return null
  }
}

/**
 * Fetch the multi-year accident-data hub payload for a city, or null if none.
 *
 * Resolution order:
 *   1. Committed static JSON (data/accident/<state>/<city>.json) — no DB needed.
 *   2. Supabase rollup tables (city_year etc.).
 *   3. null → the city page falls back to the modeled estimate.
 *
 * The Supabase path matches on city name (case-insensitive) because location
 * records don't carry a county; the county is derived from the returned rows.
 * If the city name maps to more than one county (rare), the county with the
 * most rows wins.
 */
export async function getAccidentData(
  cityName: string,
  stateSlug: string,
  citySlug?: string,
): Promise<AccidentData | null> {
  // 1. Static JSON first (no database required).
  const staticData = await readStaticAccidentData(stateSlug, citySlug || slugify(cityName))
  if (staticData) return staticData

  try {
    // 2. City rows across all years (the required signal — no rows => fall back).
    const { data: cityRows, error: cityErr } = await supabaseServer
      .from('city_year')
      .select('*')
      .ilike('city', cityName)
      .order('year', { ascending: true })

    if (cityErr || !cityRows || cityRows.length === 0) return null

    // Resolve the dominant county for this city name.
    const countyCounts = new Map<string, number>()
    for (const r of cityRows as any[]) {
      const c = (r.county ?? '').trim()
      if (c) countyCounts.set(c, (countyCounts.get(c) ?? 0) + 1)
    }
    const county =
      [...countyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
      ((cityRows as any[])[0].county ?? '')

    const dbCity = (cityRows as any[])[0].city ?? cityName
    const years = (cityRows as any[])
      .filter((r) => (r.county ?? '').trim() === county || !county)
      .map(mapCityYear)

    // State abbreviation / display name from the state config.
    let stateName = stateSlug
    let stateAbbr = stateSlug.toUpperCase().slice(0, 2)
    try {
      const cfg = await StateDataLoader.getStateConfig(stateSlug)
      if (cfg?.name) stateName = cfg.name
      if (cfg?.abbreviation) stateAbbr = cfg.abbreviation
    } catch {
      /* keep fallbacks */
    }

    // 2-6. Benchmarks + where/when data, in parallel. All are optional.
    const [countyRes, stateRes, timeRes, roadsRes, intxRes] = await Promise.all([
      supabaseServer.from('county_year').select('year, population, injuries, fatalities').ilike('county', county),
      supabaseServer.from('state_year').select('year, population, injuries, fatalities'),
      supabaseServer.from('city_time_profile').select('dim, bucket, crashes, injuries, fatalities').ilike('city', dbCity).ilike('county', county),
      supabaseServer.from('city_top_roads').select('rank, road, crashes, injuries, fatalities').ilike('city', dbCity).ilike('county', county).order('rank', { ascending: true }),
      supabaseServer.from('city_top_intersections').select('rank, intersection, crashes, injuries, fatalities').ilike('city', dbCity).ilike('county', county).order('rank', { ascending: true }),
    ])

    const timeRows = (timeRes.data ?? []) as any[]
    const hours = timeRows
      .filter((r) => r.dim === 'hour')
      .map((r) => ({ bucket: num(r.bucket), crashes: num(r.crashes), injuries: num(r.injuries), fatalities: num(r.fatalities) }))
      .sort((a, b) => a.bucket - b.bucket)
    const dow = timeRows
      .filter((r) => r.dim === 'dow')
      .map((r) => ({ bucket: num(r.bucket), crashes: num(r.crashes), injuries: num(r.injuries), fatalities: num(r.fatalities) }))
      .sort((a, b) => a.bucket - b.bucket)

    return {
      city: dbCity,
      county,
      state: stateName,
      stateAbbr,
      years,
      county_benchmark: benchIndex(countyRes.data as any[]),
      state_benchmark: benchIndex(stateRes.data as any[]),
      timeProfile: {
        span: null, // derived window; left null unless you track it explicitly
        hours,
        dow,
      },
      topRoads: ((roadsRes.data ?? []) as any[]).map((r) => ({
        rank: num(r.rank), road: r.road, crashes: num(r.crashes), injuries: num(r.injuries), fatalities: num(r.fatalities),
      })),
      topIntersections: ((intxRes.data ?? []) as any[]).map((r) => ({
        rank: num(r.rank), intersection: r.intersection, crashes: num(r.crashes), injuries: num(r.injuries), fatalities: num(r.fatalities),
      })),
    }
  } catch {
    return null
  }
}
