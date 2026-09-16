"use client"

/**
 * Accident-data hub — real SWITRS multi-year crash data (California).
 *
 * Server-rendered data (see lib/get-accident-data.ts) is passed in as a prop;
 * all interactivity (year select, compare, metric toggles, sort/search) is
 * client-side. Rates are derived at render, never stored. Provisional-year
 * "vs prior year" deltas are suppressed (TIMS guidance). Framing is factual
 * public-record only (SB-37) — no danger verdicts or outcome language.
 *
 * Replaces the modeled-estimate section for cities that have real data; the
 * page falls back to <AccidentStatistics> when getAccidentData() returns null.
 */

import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Car,
  Clock,
  MapPin,
  Activity,
  Info,
  Search,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn, AnimatedNumber } from "@/components/animations"
import type { AccidentData, CityYear, FI } from "@/lib/get-accident-data"

/* ------------------------------------------------------------------ config */

const HEADLINE: Array<{ key: keyof CityYear; label: string; accent?: boolean }> = [
  { key: "fatalCrashes", label: "Fatal crashes", accent: true },
  { key: "injuryCrashes", label: "Injury crashes" },
  { key: "fatalities", label: "Fatalities", accent: true },
  { key: "injuries", label: "Injuries" },
]

const BREAKDOWN: Array<{ key: keyof CityYear; label: string; silo: string }> = [
  { key: "occupant", label: "Vehicle occupants", silo: "Car & Truck Accidents" },
  { key: "pedestrian", label: "Pedestrians", silo: "Car & Truck · Wrongful Death" },
  { key: "bicyclist", label: "Bicyclists", silo: "Car & Truck Accidents" },
  { key: "motorcyclist", label: "Motorcyclists", silo: "Car & Truck Accidents" },
  { key: "alcohol", label: "DUI / alcohol-involved", silo: "Car & Truck · Wrongful Death" },
  { key: "distracted", label: "Distracted driving", silo: "Car & Truck Accidents" },
  { key: "speeding", label: "Speeding", silo: "Car & Truck Accidents" },
]

const CHART_METRICS: Array<{ key: keyof CityYear; label: string }> = [
  { key: "injuryCrashes", label: "Injury crashes" },
  { key: "fatalCrashes", label: "Fatal crashes" },
  { key: "injuries", label: "Injuries" },
  { key: "fatalities", label: "Fatalities" },
]

const COMPARE_METRICS: Array<{ key: "injuries" | "fatalities"; label: string; noun: string }> = [
  { key: "injuries", label: "Injury rate", noun: "injury rate" },
  { key: "fatalities", label: "Fatality rate", noun: "fatality rate" },
]

const TABLE_COLS: Array<{ key: string; label: string }> = [
  { key: "year", label: "Year" },
  { key: "fatalCrashes", label: "Fatal" },
  { key: "injuryCrashes", label: "Injury" },
  { key: "fatalities", label: "Killed" },
  { key: "injuries", label: "Injured" },
  { key: "seriousInjuries", label: "Serious" },
  { key: "population", label: "Pop." },
  { key: "rate", label: "Inj/100k" },
]

const DOW_LABELS = ["M", "T", "W", "T", "F", "S", "S"]
const DOW_NAMES = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"]

// Trend window: the module starts the year axis here (2020 keeps the COVID
// dip→recovery story). Years before this — and any status='partial' year — are
// hidden, since partial/pre-window years shouldn't be compared to full ones.
const START_YEAR = 2020

const DEFAULT_SOURCE = "CCRS · data.ca.gov + CA population"

/* ----------------------------------------------------------------- helpers */

const fmt = (n: number) => n.toLocaleString("en-US")
const rate = (v: number, pop: number | null | undefined): number | null =>
  pop && pop > 0 ? (v / pop) * 100000 : null
const isPair = (v: unknown): v is FI =>
  typeof v === "object" && v !== null && "f" in (v as any) && "i" in (v as any)
const metricValue = (d: CityYear, k: keyof CityYear): number => {
  const v = d[k]
  if (isPair(v)) return v.f + v.i
  return typeof v === "number" ? v : 0
}
const hr12 = (h: number) => {
  const ap = h < 12 ? "a" : "p"
  let x = h % 12
  if (!x) x = 12
  return `${x}${ap}`
}

/**
 * Headline figure that is safe for SSR/SEO and prefers-reduced-motion: the real
 * number is always in the server HTML and shown instantly when motion is off;
 * on the client with motion allowed it upgrades to the count-up AnimatedNumber.
 */
function Stat({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || reduce) return <span className={className}>{value.toLocaleString("en-US")}</span>
  return <AnimatedNumber value={value} className={className} />
}

function DeltaBadge({ delta, suppressed }: { delta: number | null; suppressed?: boolean }) {
  if (suppressed) {
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">— provisional</span>
  }
  if (delta === null) {
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">—</span>
  }
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
        <Minus className="h-3.5 w-3.5" /> 0
      </span>
    )
  }
  const up = delta > 0
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-red-600" : "text-green-600"}`}>
      {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      {Math.abs(delta)}
    </span>
  )
}

/* --------------------------------------------------------------- component */

interface Props {
  data: AccidentData
  cityLabel?: string
}

export function AccidentDataHub({ data, cityLabel }: Props) {
  const reduce = useReducedMotion()
  // Apply the trend window: drop pre-START_YEAR and provisional-partial years.
  const years = useMemo(
    () =>
      data.years
        .filter((d) => d.year >= START_YEAR && d.status !== "partial")
        .sort((a, b) => a.year - b.year),
    [data.years],
  )
  const cityName = cityLabel || data.city
  const byYear = useMemo(() => Object.fromEntries(years.map((d) => [d.year, d])) as Record<number, CityYear>, [years])
  const yearList = useMemo(() => years.map((d) => d.year), [years])
  // Default to the latest FINALIZED year (not a provisional/part-year row), so
  // the section leads with complete data. Users can still pick provisional years.
  const finalYears = years.filter((d) => d.status === "final").map((d) => d.year)
  const latestFinal = finalYears.length ? Math.max(...finalYears) : yearList[yearList.length - 1]
  const defaultB = yearList[yearList.indexOf(latestFinal) - 1] ?? yearList[yearList.length - 2] ?? latestFinal

  const [yearA, setYearA] = useState<number>(latestFinal)
  const [yearB, setYearB] = useState<number>(defaultB)
  const [compare, setCompare] = useState(false)
  const [cmpMetric, setCmpMetric] = useState<"injuries" | "fatalities">("injuries")
  const [chartMetric, setChartMetric] = useState<keyof CityYear>("injuryCrashes")
  const [sortKey, setSortKey] = useState<string>("year")
  const [sortDir, setSortDir] = useState<number>(-1)
  const [filter, setFilter] = useState("")

  const a = byYear[yearA]
  const aPrev = byYear[yearA - 1]
  const b = byYear[yearB]
  const provSuppressed = a?.status === "prov"

  /* animation presets */
  const barTransition = (i: number) => (reduce ? { duration: 0 } : { duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] as const })

  /* ---- comparison band ---- */
  const cmpRows = useMemo(() => {
    const cYear = byYear[yearA]
    if (!cYear) return []
    const co = data.county_benchmark[yearA]
    const st = data.state_benchmark[yearA]
    const rows = [
      { cls: "city" as const, name: cityName, r: rate(cYear[cmpMetric], cYear.population) },
      // Only compare against the county when we actually know it.
      ...(data.county
        ? [{ cls: "county" as const, name: `${data.county} County`, r: rate(co?.[cmpMetric] ?? 0, co?.population) }]
        : []),
      { cls: "state" as const, name: data.state, r: rate(st?.[cmpMetric] ?? 0, st?.population) },
    ]
    return rows
  }, [byYear, yearA, cmpMetric, data, cityName])
  // The comparison band is per-capita; it only makes sense when the city has population.
  const hasCityPop = years.some((y) => y.population)
  const cmpMax = Math.max(1, ...cmpRows.map((x) => x.r ?? 0))
  const cmpNoun = COMPARE_METRICS.find((m) => m.key === cmpMetric)!.noun

  /* ---- trend chart ---- */
  const chartVals = years.map((d) => metricValue(d, chartMetric))
  const chartMax = Math.max(1, ...chartVals)

  /* ---- table rows ---- */
  const tableVal = (d: CityYear, k: string): number => {
    if (k === "population") return d.population ?? 0
    if (k === "rate") return rate(d.injuries, d.population) ?? 0
    if (k === "year") return d.year
    return metricValue(d, k as keyof CityYear)
  }
  const tableRows = useMemo(() => {
    let rows = years.slice()
    if (filter) rows = rows.filter((d) => String(d.year).includes(filter))
    rows.sort((x, y) => (tableVal(x, sortKey) - tableVal(y, sortKey)) * sortDir)
    return rows
  }, [years, filter, sortKey, sortDir])

  /* ---- peak times ---- */
  const hours = data.timeProfile.hours
  const dow = data.timeProfile.dow
  const hasHours = hours.length > 0
  const hasDow = dow.length > 0
  const peak = useMemo(() => {
    if (!hasHours) return null
    const H = Array.from({ length: 24 }, (_, i) => hours.find((h) => h.bucket === i)?.crashes ?? 0)
    let best = -1
    let bi = 0
    for (let i = 0; i < 24; i++) {
      const sum = H[i] + H[(i + 1) % 24] + H[(i + 2) % 24]
      if (sum > best) { best = sum; bi = i }
    }
    return { H, bi, hmax: Math.max(1, ...H) }
  }, [hours, hasHours])
  const peakDow = useMemo(() => {
    if (!hasDow) return null
    const D = Array.from({ length: 7 }, (_, i) => dow.find((d) => d.bucket === i + 1)?.crashes ?? 0)
    const dmax = Math.max(1, ...D)
    return { D, di: D.indexOf(Math.max(...D)), dmax }
  }, [dow, hasDow])

  const setSort = (k: string) => {
    if (sortKey === k) setSortDir((d) => d * -1)
    else { setSortKey(k); setSortDir(-1) }
  }

  if (!a) return null

  const injRate = rate(a.injuries, a.population)
  const fatRate = rate(a.fatalities, a.population)

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        {/* ---------- Header ---------- */}
        <FadeIn direction="up" delay={0.1}>
          <div className="border-b border-gray-200 pb-5 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-7 w-7 text-orange-500 flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {cityName} <span className="text-gray-500 font-semibold">· {data.stateAbbr}</span> Traffic Injury &amp; Crash Data
              </h2>
            </div>
            <p className="mt-1 text-gray-600">
              Reported traffic injuries &amp; collisions{data.county ? ` — ${data.county} County` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                Source:{" "}
                <a href="https://data.ca.gov/dataset/ccrs" target="_blank" rel="noopener noreferrer"
                   className="text-gray-600 hover:text-orange-600 underline decoration-dotted inline-flex items-center gap-0.5">
                  CCRS · data.ca.gov <ExternalLink className="h-3 w-3" />
                </a>
              </span>
              <span className="inline-flex items-center gap-1">
                Fatal totals cross-checked against{" "}
                <a href="https://www-fars.nhtsa.dot.gov/" target="_blank" rel="noopener noreferrer"
                   className="text-gray-600 hover:text-orange-600 underline decoration-dotted inline-flex items-center gap-0.5">
                  NHTSA FARS <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            </div>
          </div>
        </FadeIn>

        {/* ---------- Controls ---------- */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Year
            <Select value={String(yearA)} onValueChange={(v) => setYearA(Number(v))}>
              <SelectTrigger className="w-[92px] h-9 bg-white font-semibold"><SelectValue /></SelectTrigger>
              <SelectContent>
                {yearList.slice().reverse().map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <button
            type="button"
            onClick={() => setCompare((c) => !c)}
            aria-pressed={compare}
            className={`inline-flex items-center gap-2 h-9 px-3 rounded-md border text-sm font-medium transition-colors ${
              compare ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className={`h-4 w-4 rounded border flex items-center justify-center ${compare ? "bg-orange-500 border-orange-500" : "border-gray-400"}`}>
              {compare && <span className="text-white text-[10px] leading-none">✓</span>}
            </span>
            Compare
          </button>

          {compare && (
            <label className="flex items-center gap-2 text-sm text-gray-600">
              vs
              <Select value={String(yearB)} onValueChange={(v) => setYearB(Number(v))}>
                <SelectTrigger className="w-[92px] h-9 bg-white font-semibold"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {yearList.slice().reverse().map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          )}

          <Badge
            variant="outline"
            className={`ml-auto ${a.status === "prov" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}
          >
            {a.status === "prov" ? "Provisional" : "Finalized"}
          </Badge>
        </div>

        {/* ---------- Headline cards ---------- */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {HEADLINE.map((m) => {
            const va = metricValue(a, m.key)
            const vb = b ? metricValue(b, m.key) : null
            const vprev = aPrev ? metricValue(aPrev, m.key) : null
            return (
              <Card key={m.key as string} className="border-0 shadow-lg bg-white">
                <CardContent className="p-4 md:p-5">
                  <div className="text-xs md:text-sm text-gray-600">{m.label}</div>
                  <div className={`text-3xl md:text-4xl font-extrabold tracking-tight mt-0.5 ${m.accent ? "text-orange-600" : "text-gray-900"}`}>
                    <Stat value={va} />
                  </div>
                  {compare && vb !== null ? (
                    <div className="mt-1 text-sm text-gray-500 font-semibold flex items-center gap-2">
                      <span>{yearB}: {fmt(vb)}</span>
                      <DeltaBadge delta={va - vb} />
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                      <DeltaBadge delta={vprev === null ? null : va - vprev} suppressed={provSuppressed} />
                      <span>vs {yearA - 1}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* per-capita line */}
        <p className="mt-3 px-1 text-sm text-gray-600">
          Injury rate: <b className="text-gray-900">{injRate === null ? "—" : injRate.toFixed(1)}</b> per 100k
          {" · "}Fatality rate: <b className="text-gray-900">{fatRate === null ? "—" : fatRate.toFixed(1)}</b> per 100k
          {a.population ? <> {" · "}Pop. <b className="text-gray-900">{fmt(a.population)}</b></> : null}
        </p>

        {/* ---------- Comparison band (per-capita; needs city population) ---------- */}
        {hasCityPop && (
        <FadeIn direction="up" delay={0.15}>
          <div className="mt-8">
            <h3 className="text-base font-bold text-gray-900">How {cityName} compares</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">
              Rate per 100,000 residents — the only fair way to compare a city to its county and state.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMPARE_METRICS.map((m) => {
                const active = m.key === cmpMetric
                return (
                  <button key={m.key} type="button" onClick={() => setCmpMetric(m.key)} aria-pressed={active}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      active ? "bg-orange-50 text-orange-700 border-orange-300" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}>
                    {m.label}
                  </button>
                )
              })}
            </div>
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-4 md:p-5">
                <div key={`${cmpMetric}-${yearA}`} className="space-y-2">
                  {cmpRows.map((row, i) => (
                    <div key={row.cls} className="grid grid-cols-[84px_1fr_auto] items-center gap-3">
                      <span className={`text-sm ${row.cls === "city" ? "text-gray-900 font-bold" : "text-gray-500"}`}>{row.name}</span>
                      <span className="h-3 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                        <motion.span
                          className={`block h-full rounded-full ${row.cls === "city" ? "bg-orange-500" : "bg-gray-400"}`}
                          initial={{ width: reduce ? `${((row.r ?? 0) / cmpMax) * 100}%` : 0 }}
                          whileInView={{ width: `${((row.r ?? 0) / cmpMax) * 100}%` }}
                          viewport={{ once: true }}
                          transition={barTransition(i)}
                        />
                      </span>
                      <span className="text-sm font-bold text-gray-900 text-right tabular-nums min-w-[52px]">
                        {row.r === null ? "—" : row.r.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <CompareInterp rows={cmpRows} noun={cmpNoun} city={cityName} year={yearA} />
              </CardContent>
            </Card>
          </div>
        </FadeIn>
        )}

        {/* ---------- Breakdown ---------- */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mt-8">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Car className="h-5 w-5 text-orange-500" /> By road-user &amp; contributing factor
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">Δ vs prior year. Feeds the Car &amp; Truck and Wrongful Death silos.</p>
            <Card className="border-0 shadow-lg bg-white overflow-hidden">
              <CardContent className="p-0">
                {BREAKDOWN.map((m) => {
                  const cur = a[m.key] as FI
                  const prev = aPrev ? (aPrev[m.key] as FI) : null
                  const tot = cur.f + cur.i
                  const ptot = prev ? prev.f + prev.i : null
                  return (
                    <div key={m.key as string} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{m.label}</div>
                        <div className="text-[11px] text-gray-400">→ {m.silo}</div>
                      </div>
                      <div className="text-xs text-gray-500 text-right whitespace-nowrap">
                        <b className="text-gray-900">{fmt(cur.i)}</b> inj · <b className="text-gray-900">{fmt(cur.f)}</b> ftl
                      </div>
                      <div className="min-w-[64px] text-right">
                        <DeltaBadge delta={ptot === null ? null : tot - ptot} suppressed={provSuppressed} />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* ---------- When crashes happen ---------- */}
        {(peak || peakDow) && (
          <FadeIn direction="up" delay={0.2}>
            <div className="mt-8">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" /> When crashes happen
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-3">Reported collisions by time of day and weekday{data.timeProfile.span ? `, ${data.timeProfile.span}` : ""}.</p>
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-4 md:p-5">
                  <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                    Most collisions are reported
                    {peakDow ? <> on <b className="text-orange-600">{DOW_NAMES[peakDow.di]}</b></> : null}
                    {peak ? <> and between <b className="text-orange-600">{hr12(peak.bi)}–{hr12((peak.bi + 3) % 24)}</b></> : null}.
                  </p>
                  {peak && (
                    <>
                      <div className="flex items-end gap-[2px] h-[72px]">
                        {peak.H.map((v, i) => {
                          const isPeak = i === peak.bi || i === (peak.bi + 1) % 24 || i === (peak.bi + 2) % 24
                          return (
                            <motion.span key={i} className={`flex-1 min-w-0 rounded-t-sm border border-b-0 ${isPeak ? "bg-orange-500 border-orange-500" : "bg-gray-100 border-gray-200"}`}
                              title={`${hr12(i)}: ${v}`}
                              initial={{ height: reduce ? `${Math.max(4, (v / peak.hmax) * 68)}px` : 0 }}
                              whileInView={{ height: `${Math.max(4, (v / peak.hmax) * 68)}px` }}
                              viewport={{ once: true }} transition={barTransition(i)} />
                          )
                        })}
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                        <span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>11p</span>
                      </div>
                    </>
                  )}
                  {peakDow && (
                    <div className="flex items-end gap-1.5 h-[52px] mt-4">
                      {peakDow.D.map((v, i) => (
                        <div key={i} className="flex-1 min-w-0 flex flex-col items-center justify-end gap-1 h-full">
                          <motion.span className={`w-full max-w-[26px] rounded-t border border-b-0 ${i === peakDow.di ? "bg-orange-500 border-orange-500" : "bg-gray-100 border-gray-200"}`}
                            initial={{ height: reduce ? `${Math.max(6, (v / peakDow.dmax) * 34)}px` : 0 }}
                            whileInView={{ height: `${Math.max(6, (v / peakDow.dmax) * 34)}px` }}
                            viewport={{ once: true }} transition={barTransition(i)} />
                          <span className="text-[10px] text-gray-400">{DOW_LABELS[i]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        )}

        {/* ---------- Top roads ---------- */}
        {data.topRoads.length > 0 && (
          <FadeIn direction="up" delay={0.2}>
            <div className="mt-8">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" /> Roads with the most reported collisions
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-3">Ranked by injuries and fatalities{data.timeProfile.span ? `, ${data.timeProfile.span}` : ""}.</p>
              <Card className="border-0 shadow-lg bg-white overflow-hidden">
                <CardContent className="p-0">
                  <BarRows items={data.topRoads.map((r) => ({ name: r.road, inj: r.injuries, ftl: r.fatalities }))} reduce={!!reduce} />
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        )}

        {/* ---------- Top intersections ---------- */}
        {data.topIntersections.length > 0 && (
          <FadeIn direction="up" delay={0.2}>
            <div className="mt-8">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" /> Highest-collision intersections
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-3">Junctions with the most reported crashes.</p>
              <Card className="border-0 shadow-lg bg-white overflow-hidden">
                <CardContent className="p-0">
                  <BarRows items={data.topIntersections.map((r) => ({ name: r.intersection, inj: r.injuries, ftl: r.fatalities }))} reduce={!!reduce} />
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        )}

        {/* ---------- Trend chart ---------- */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mt-8">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" /> Trend
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">
              {CHART_METRICS.find((m) => m.key === chartMetric)!.label} by year — tap a bar to load that year above.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {CHART_METRICS.map((m) => {
                const active = m.key === chartMetric
                return (
                  <button key={m.key as string} type="button" onClick={() => setChartMetric(m.key)} aria-pressed={active}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      active ? "bg-orange-50 text-orange-700 border-orange-300" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}>
                    {m.label}
                  </button>
                )
              })}
            </div>
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-4">
                <div key={chartMetric as string} className="flex items-end gap-1.5 h-[150px]">
                  {years.map((d, i) => {
                    const val = metricValue(d, chartMetric)
                    const h = Math.max(6, Math.round((val / chartMax) * 128))
                    const sel = d.year === yearA
                    return (
                      <button key={d.year} type="button" onClick={() => setYearA(d.year)}
                        className="flex-1 min-w-0 flex flex-col items-center justify-end gap-1.5 h-full group"
                        aria-label={`${d.year}: ${val}`}>
                        <span className={`text-[10px] leading-none ${sel ? "text-orange-600 font-bold" : "text-gray-500"}`}>{val}</span>
                        <motion.span className={`w-full max-w-[34px] rounded-t border border-b-0 ${sel ? "bg-orange-500 border-orange-500" : "bg-gray-100 border-gray-300 group-hover:bg-gray-200"}`}
                          initial={{ height: reduce ? `${h}px` : 0 }}
                          whileInView={{ height: `${h}px` }}
                          viewport={{ once: true }} transition={barTransition(i)} />
                        <span className="text-[11px] text-gray-400">&apos;{String(d.year).slice(2)}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* ---------- Year over year table ---------- */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mt-8">
            <h3 className="text-base font-bold text-gray-900">Year over year</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">Search or sort any column. Every row is one finalized (or provisional) SWITRS year.</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2">
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <input value={filter} onChange={(e) => setFilter(e.target.value.trim())} inputMode="numeric"
                  placeholder="Filter by year…" aria-label="Filter table by year"
                  className="w-full bg-transparent text-sm outline-none text-gray-900 placeholder:text-gray-400" />
              </div>
            </div>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-lg">
              <table className="w-full min-w-[520px] text-sm border-collapse tabular-nums">
                <thead>
                  <tr>
                    {TABLE_COLS.map((c, idx) => (
                      <th key={c.key} tabIndex={0} onClick={() => setSort(c.key)}
                        className={`sticky top-0 bg-gray-50 text-gray-500 font-semibold px-3 py-2.5 text-xs cursor-pointer whitespace-nowrap border-b border-gray-200 ${idx === 0 ? "text-left" : "text-right"}`}>
                        {c.label}{" "}
                        <span className="text-gray-300 text-[10px]">{sortKey === c.key ? (sortDir < 0 ? "▼" : "▲") : ""}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((d) => (
                    <tr key={d.year} className="hover:bg-gray-50">
                      {TABLE_COLS.map((c, idx) => {
                        let v: string
                        if (c.key === "rate") v = (rate(d.injuries, d.population) ?? 0).toFixed(1)
                        else if (c.key === "population") v = d.population ? fmt(d.population) : "—"
                        else if (c.key === "year") v = String(d.year)
                        else v = fmt(metricValue(d, c.key as keyof CityYear))
                        return (
                          <td key={c.key} className={`px-3 py-2.5 border-b border-gray-100 whitespace-nowrap ${idx === 0 ? "text-left font-bold text-gray-900" : "text-right text-gray-700"}`}>
                            {v}
                            {idx === 0 && d.status === "prov" && <sup className="ml-1 text-[10px] text-orange-600 font-semibold">prov</sup>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* ---------- Methodology footer ---------- */}
        <div className="mt-8 pt-5 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
          <p className="inline-flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>
              <b className="text-gray-600">Source:</b> {data.source || DEFAULT_SOURCE}. Collision counts are
              reported crashes from California&apos;s Crash Reporting System (CCRS), published on data.ca.gov and
              aggregated to city jurisdiction; fatality totals are cross-checked against NHTSA&apos;s Fatality
              Analysis Reporting System (FARS). Rates per 100,000 use annual city population. Years marked{" "}
              <b className="text-orange-600">prov</b> are provisional and update as the record is finalized.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------- sub-components */

function CompareInterp({
  rows,
  noun,
  city,
  year,
}: {
  rows: Array<{ cls: string; r: number | null }>
  noun: string
  city: string
  year: number
}) {
  const cityR = rows.find((r) => r.cls === "city")?.r ?? null
  const countyR = rows.find((r) => r.cls === "county")?.r ?? null
  const stateR = rows.find((r) => r.cls === "state")?.r ?? null
  if (cityR === null) {
    return <p className="mt-3 text-sm text-gray-500">Population data for {year} is not yet available, so a per-capita comparison can&apos;t be shown for this year.</p>
  }
  const hasCounty = rows.some((r) => r.cls === "county")
  const phrase = (ref: number | null, label: string) => {
    if (ref === null || ref === 0) return <>data for the {label} isn&apos;t available</>
    const p = ((cityR - ref) / ref) * 100
    if (Math.abs(p) < 2) return <>about even with the {label} average</>
    const above = p > 0
    return (
      <>
        <b className={above ? "text-red-600" : "text-green-600"}>{Math.abs(p).toFixed(0)}% {above ? "above" : "below"}</b> the {label} average
      </>
    )
  }
  return (
    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
      In {year}, {city}&apos;s {noun} of <b className="text-gray-900">{cityR.toFixed(1)} per 100k</b> ran{" "}
      {hasCounty ? <>{phrase(countyR, "county")} and </> : null}{phrase(stateR, "state")}.
    </p>
  )
}

function BarRows({ items, reduce }: { items: Array<{ name: string; inj: number; ftl: number }>; reduce: boolean }) {
  const max = Math.max(1, ...items.map((r) => r.inj))
  return (
    <>
      {items.map((r, i) => (
        <div key={`${r.name}-${i}`} className="px-4 py-3 border-b border-gray-100 last:border-0">
          <div className="flex justify-between items-baseline gap-3 mb-1.5">
            <span className="text-sm font-semibold text-gray-800">{r.name}</span>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              <b className="text-gray-900">{r.inj.toLocaleString("en-US")}</b> inj · <b className="text-gray-900">{r.ftl}</b> ftl
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
              initial={{ width: reduce ? `${Math.round((r.inj / max) * 100)}%` : 0 }}
              whileInView={{ width: `${Math.round((r.inj / max) * 100)}%` }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </div>
      ))}
    </>
  )
}
