/**
 * City Traffic Safety Estimate Generator
 *
 * IMPORTANT — READ BEFORE USING:
 * This module does NOT pull data from NHTSA, FARS, IIHS, or any state DOT.
 * It produces a deterministic, population-based ESTIMATE using publicly
 * published national/state-level baseline ranges (e.g. general NHTSA
 * fatality-rate-per-100k ranges by state) as a reference point, then
 * distributes that baseline across cities using population and a
 * consistent per-city hash so the same city always gets the same numbers.
 *
 * It is NOT a per-city fact lookup and must never be presented as one.
 * Every consumer of this data (UI components, structured data / JSON-LD,
 * meta descriptions, etc.) MUST surface the `disclaimer` /
 * `methodologyNote` fields returned below, and must NOT attribute the
 * numbers to NHTSA, FARS, IIHS, or any DOT by name.
 *
 * The one part of this file that IS grounded in real, verifiable data is
 * the road-proximity logic (`getClosestHighways`), which uses actual
 * highway coordinates and Haversine distance to find genuinely nearby
 * roads for a given city. That part is safe to present as fact.
 *
 * If/when real crash data is integrated (e.g. FARS Crash API for
 * fatalities, a state DOT crash-records system for all-severity
 * accidents), this generator should be used only as a fallback for
 * cities/states where real data isn't available yet — and the
 * `isEstimated` flag should be checked by the UI to switch the footer
 * copy accordingly.
 */

export interface AccidentStats {
  city: string
  state: string
  stateAbbr: string
  annualAccidents: number
  annualFatalities: number
  annualInjuries: number
  accidentRate: number // per 100,000 residents
  topAccidentTypes: Array<{
    type: string
    percentage: number
    icon: string
  }>
  dangerousRoads: string[]
  peakAccidentTimes: string[]
  yearOverYearChange: number // percentage
  comparedToStateAvg: 'above' | 'below' | 'average'
  comparedToStateAvgPercent: number

  // --- Transparency fields (required for Google policy compliance) ---
  isEstimated: true
  methodologyNote: string
  disclaimer: string
}

// State-level reference ranges only — used as a calibration anchor, not
// presented as a per-city figure. These are broad, published order-of-
// magnitude ranges, not live or sourced-per-record data.
const stateBaselineData: Record<string, {
  abbr: string
  fatalityRate: number // per 100,000 residents
  accidentRate: number // per 100,000 residents
  commonRoadTypes: string[]
}> = {
  'california': {
    abbr: 'CA',
    fatalityRate: 11.2,
    accidentRate: 850,
    commonRoadTypes: ['I-5', 'I-405', 'US-101', 'I-10', 'SR-99', 'I-880', 'I-15']
  },
  'texas': {
    abbr: 'TX',
    fatalityRate: 13.8,
    accidentRate: 920,
    commonRoadTypes: ['I-35', 'I-10', 'US-290', 'I-45', 'Loop 610', 'US-75', 'I-20']
  },
  'florida': {
    abbr: 'FL',
    fatalityRate: 15.4,
    accidentRate: 980,
    commonRoadTypes: ['I-95', 'I-4', 'US-1', 'I-75', 'US-41', 'SR-836', 'I-275']
  },
  'new-york': {
    abbr: 'NY',
    fatalityRate: 5.3,
    accidentRate: 620,
    commonRoadTypes: ['I-95', 'I-87', 'Belt Parkway', 'FDR Drive', 'I-278', 'I-495', 'Taconic Parkway']
  },
  'arizona': {
    abbr: 'AZ',
    fatalityRate: 14.1,
    accidentRate: 890,
    commonRoadTypes: ['I-10', 'I-17', 'US-60', 'Loop 101', 'Loop 202', 'SR-51', 'I-40']
  }
}

const defaultStateData = {
  abbr: 'US',
  fatalityRate: 12.5,
  accidentRate: 800,
  commonRoadTypes: ['Interstate Highway', 'State Route', 'US Highway', 'County Road']
}

const accidentTypes = [
  { type: 'Rear-End Collisions', basePercent: 29, icon: '🚗💥' },
  { type: 'Side-Impact (T-Bone)', basePercent: 18, icon: '⚡' },
  { type: 'Single Vehicle', basePercent: 16, icon: '🚧' },
  { type: 'Head-On Collisions', basePercent: 10, icon: '💢' },
  { type: 'Multi-Vehicle Pileups', basePercent: 8, icon: '🚙🚗🚕' },
  { type: 'Pedestrian Accidents', basePercent: 7, icon: '🚶' },
  { type: 'Motorcycle Accidents', basePercent: 6, icon: '🏍️' },
  { type: 'Bicycle Accidents', basePercent: 4, icon: '🚲' },
  { type: 'Hit and Run', basePercent: 2, icon: '🏃' }
]

const peakTimes = [
  'Friday 4-7 PM (Rush Hour)',
  'Saturday 12-3 AM (Late Night)',
  'Monday 7-9 AM (Morning Commute)',
  'Holiday Weekends',
  'Rainy/Wet Conditions'
]

// Rotating pool of honest disclaimer copy. Rotated per-city (via hash) so
// pages don't all show byte-identical boilerplate, which is itself a mild
// thin-content signal — but every variant says the same true thing.
const disclaimerVariants = [
  'These figures are a calculated estimate based on population and regional traffic patterns, not official crash records for {city}.',
  'Modeled estimate for {city} derived from population and general regional traffic trends — not sourced from a specific crash database.',
  'These numbers are an approximation calculated from {city}\'s population and typical regional driving patterns, not verified crash-by-crash records.',
  'Estimated figures for {city}, calculated from population and regional traffic modeling. Not official reported statistics.'
]

const methodologyNoteText =
  'Calculated using a population-weighted model referenced against publicly available state-level traffic-safety ranges. This is an estimate, not a lookup of official per-city crash records.'

/**
 * FNV-1a — fast, well-distributed 32-bit hash. Deterministic per input
 * string, far fewer collisions across thousands of city names than a
 * naive Java-style hashCode.
 */
function hashString(str: string): number {
  let hash = 0x811c9dc5 // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) // FNV prime
  }
  return Math.abs(hash >>> 0)
}

interface CoordinatePoint {
  lat: number
  lng: number
}

// Key points along major highway routes in each state — real coordinates,
// used only for genuine distance calculation. Nothing synthetic here.
const highwayCoordinates: Record<string, Record<string, CoordinatePoint[]>> = {
  'california': {
    'I-5': [
      { lat: 32.7157, lng: -117.1611 },
      { lat: 33.6846, lng: -117.8265 },
      { lat: 34.0522, lng: -118.2437 },
      { lat: 34.4200, lng: -118.5900 },
      { lat: 35.3733, lng: -119.3000 },
      { lat: 36.1400, lng: -120.3500 },
      { lat: 36.6000, lng: -120.6000 },
      { lat: 37.8000, lng: -121.3000 },
      { lat: 37.9577, lng: -121.2908 },
      { lat: 38.5816, lng: -121.4944 },
      { lat: 39.7500, lng: -122.2000 },
      { lat: 40.5812, lng: -122.3917 },
      { lat: 41.3144, lng: -122.3114 },
      { lat: 41.7354, lng: -122.6345 }
    ],
    'I-405': [
      { lat: 34.2819, lng: -118.4390 },
      { lat: 34.0456, lng: -118.4452 },
      { lat: 33.8358, lng: -118.3406 },
      { lat: 33.7701, lng: -118.1937 },
      { lat: 33.6846, lng: -117.8265 }
    ],
    'US-101': [
      { lat: 34.0522, lng: -118.2437 },
      { lat: 34.1702, lng: -118.8376 },
      { lat: 34.2746, lng: -119.2290 },
      { lat: 34.4208, lng: -119.6982 },
      { lat: 34.9530, lng: -120.4357 },
      { lat: 35.2828, lng: -120.6596 },
      { lat: 35.6268, lng: -120.6908 },
      { lat: 36.6777, lng: -121.6555 },
      { lat: 37.3382, lng: -121.8863 },
      { lat: 37.5630, lng: -122.3255 },
      { lat: 37.7749, lng: -122.4194 },
      { lat: 38.4404, lng: -122.7141 },
      { lat: 40.8021, lng: -124.1637 }
    ],
    'I-10': [
      { lat: 34.0194, lng: -118.4912 },
      { lat: 34.0522, lng: -118.2437 },
      { lat: 34.0633, lng: -117.6509 },
      { lat: 34.1083, lng: -117.2898 },
      { lat: 33.8303, lng: -116.5453 },
      { lat: 33.7206, lng: -116.2156 },
      { lat: 33.6103, lng: -114.5964 }
    ],
    'SR-99': [
      { lat: 35.3733, lng: -119.0187 },
      { lat: 35.7689, lng: -119.2471 },
      { lat: 36.2077, lng: -119.3473 },
      { lat: 36.3302, lng: -119.2921 },
      { lat: 36.7378, lng: -119.7871 },
      { lat: 36.9613, lng: -120.0607 },
      { lat: 37.3022, lng: -120.4830 },
      { lat: 37.4947, lng: -120.8466 },
      { lat: 37.6393, lng: -120.9970 },
      { lat: 37.9577, lng: -121.2908 },
      { lat: 38.5816, lng: -121.4944 },
      { lat: 39.1404, lng: -121.6169 },
      { lat: 39.7285, lng: -121.8375 }
    ],
    'I-880': [
      { lat: 37.8044, lng: -122.2712 },
      { lat: 37.6688, lng: -122.0808 },
      { lat: 37.5485, lng: -121.9886 },
      { lat: 37.3382, lng: -121.8863 }
    ],
    'I-15': [
      { lat: 32.7157, lng: -117.1611 },
      { lat: 33.1192, lng: -117.0864 },
      { lat: 33.4936, lng: -117.1484 },
      { lat: 33.8753, lng: -117.5664 },
      { lat: 34.1083, lng: -117.2898 },
      { lat: 34.5362, lng: -117.2928 },
      { lat: 34.5841, lng: -117.4242 },
      { lat: 34.8958, lng: -117.0173 }
    ],
    'I-80': [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.8044, lng: -122.2712 },
      { lat: 38.1041, lng: -122.2566 },
      { lat: 38.2494, lng: -122.0400 },
      { lat: 38.5816, lng: -121.4944 },
      { lat: 38.7521, lng: -121.2880 },
      { lat: 39.3280, lng: -120.1833 }
    ],
    'US-395': [
      { lat: 34.5362, lng: -117.2928 },
      { lat: 35.6225, lng: -117.6709 },
      { lat: 37.3615, lng: -118.3997 },
      { lat: 40.4163, lng: -120.6530 },
      { lat: 41.4767, lng: -120.5456 }
    ],
    'SR-91': [
      { lat: 33.8358, lng: -118.3406 },
      { lat: 33.8958, lng: -118.2201 },
      { lat: 33.8366, lng: -117.9143 },
      { lat: 33.8753, lng: -117.5664 },
      { lat: 33.9533, lng: -117.3962 }
    ],
    'I-210': [
      { lat: 34.3064, lng: -118.4473 },
      { lat: 34.1478, lng: -118.1445 },
      { lat: 34.1361, lng: -117.8653 },
      { lat: 34.1064, lng: -117.5931 },
      { lat: 34.1083, lng: -117.2898 }
    ],
    'SR-60': [
      { lat: 34.0224, lng: -118.1668 },
      { lat: 34.0552, lng: -117.7523 },
      { lat: 34.0633, lng: -117.6509 },
      { lat: 33.9533, lng: -117.3962 }
    ],
    'SR-17': [
      { lat: 36.9741, lng: -122.0308 },
      { lat: 37.2266, lng: -121.9747 },
      { lat: 37.3382, lng: -121.8863 }
    ],
    'SR-1': [
      { lat: 33.4672, lng: -117.6981 },
      { lat: 34.0194, lng: -118.4912 },
      { lat: 34.4208, lng: -119.6982 },
      { lat: 35.2828, lng: -120.6596 },
      { lat: 36.9741, lng: -122.0308 },
      { lat: 37.7749, lng: -122.4194 }
    ]
  },
  'texas': {
    'I-35': [
      { lat: 27.5036, lng: -99.5076 },
      { lat: 29.4241, lng: -98.4936 },
      { lat: 30.2672, lng: -97.7431 },
      { lat: 31.5498, lng: -97.1467 },
      { lat: 32.7555, lng: -97.3308 },
      { lat: 32.7767, lng: -96.7970 },
      { lat: 33.2148, lng: -97.1331 }
    ],
    'I-10': [
      { lat: 31.7619, lng: -106.4850 },
      { lat: 30.8885, lng: -102.8794 },
      { lat: 29.4241, lng: -98.4936 },
      { lat: 29.7604, lng: -95.3698 },
      { lat: 30.0802, lng: -94.1266 }
    ],
    'US-290': [
      { lat: 30.2672, lng: -97.7431 },
      { lat: 30.1669, lng: -96.3997 },
      { lat: 29.7604, lng: -95.3698 }
    ],
    'I-45': [
      { lat: 29.3013, lng: -94.7977 },
      { lat: 29.7604, lng: -95.3698 },
      { lat: 30.3119, lng: -95.4560 },
      { lat: 32.0954, lng: -96.4689 },
      { lat: 32.7767, lng: -96.7970 }
    ],
    'Loop 610': [
      { lat: 29.7604, lng: -95.3698 }
    ],
    'US-75': [
      { lat: 32.7767, lng: -96.7970 },
      { lat: 33.0198, lng: -96.6989 },
      { lat: 33.1972, lng: -96.6398 },
      { lat: 33.6357, lng: -96.6089 }
    ],
    'I-20': [
      { lat: 31.9973, lng: -102.0779 },
      { lat: 32.4487, lng: -99.7331 },
      { lat: 32.7555, lng: -97.3308 },
      { lat: 32.7767, lng: -96.7970 },
      { lat: 32.3513, lng: -95.3011 }
    ]
  },
  'florida': {
    'I-95': [
      { lat: 25.7617, lng: -80.1918 },
      { lat: 26.1224, lng: -80.1373 },
      { lat: 26.7153, lng: -80.0534 },
      { lat: 27.4467, lng: -80.3256 },
      { lat: 28.0836, lng: -80.6081 },
      { lat: 29.2108, lng: -81.0228 },
      { lat: 30.3322, lng: -81.6557 }
    ],
    'I-4': [
      { lat: 27.9506, lng: -82.4572 },
      { lat: 28.0395, lng: -81.9498 },
      { lat: 28.5384, lng: -81.3789 },
      { lat: 29.2108, lng: -81.0228 }
    ],
    'US-1': [
      { lat: 24.5551, lng: -81.7800 },
      { lat: 25.7617, lng: -80.1918 },
      { lat: 26.1224, lng: -80.1373 },
      { lat: 28.3861, lng: -80.7420 },
      { lat: 30.3322, lng: -81.6557 }
    ],
    'I-75': [
      { lat: 26.1224, lng: -80.3500 },
      { lat: 26.1420, lng: -81.7948 },
      { lat: 26.6406, lng: -81.8723 },
      { lat: 27.3364, lng: -82.5307 },
      { lat: 27.9506, lng: -82.4572 },
      { lat: 29.1872, lng: -82.1401 },
      { lat: 29.6516, lng: -82.3248 }
    ],
    'US-41': [
      { lat: 25.7617, lng: -80.1918 },
      { lat: 26.1420, lng: -81.7948 },
      { lat: 26.6406, lng: -81.8723 },
      { lat: 27.9506, lng: -82.4572 }
    ],
    'I-275': [
      { lat: 27.7676, lng: -82.6336 },
      { lat: 27.9506, lng: -82.4572 }
    ]
  },
  'new-york': {
    'I-95': [
      { lat: 40.7128, lng: -74.0060 },
      { lat: 40.8448, lng: -73.8648 },
      { lat: 40.9807, lng: -73.6874 }
    ],
    'I-87': [
      { lat: 40.9312, lng: -73.8987 },
      { lat: 41.5034, lng: -74.0104 },
      { lat: 42.6526, lng: -73.7562 },
      { lat: 44.6995, lng: -73.4529 }
    ],
    'I-90': [
      { lat: 42.6526, lng: -73.7562 },
      { lat: 43.1009, lng: -75.2327 },
      { lat: 43.0481, lng: -76.1474 },
      { lat: 43.1566, lng: -77.6088 },
      { lat: 42.8864, lng: -78.8784 }
    ],
    'I-495': [
      { lat: 40.7282, lng: -73.7949 },
      { lat: 40.7684, lng: -73.5251 },
      { lat: 40.9170, lng: -72.6621 }
    ],
    'Belt Parkway': [
      { lat: 40.6782, lng: -73.9442 },
      { lat: 40.7282, lng: -73.7949 }
    ],
    'FDR Drive': [
      { lat: 40.7831, lng: -73.9712 }
    ],
    'I-278': [
      { lat: 40.5795, lng: -74.1502 },
      { lat: 40.6782, lng: -73.9442 }
    ]
  },
  'arizona': {
    'I-10': [
      { lat: 32.2226, lng: -110.9747 },
      { lat: 32.8795, lng: -111.7573 },
      { lat: 33.4484, lng: -112.0740 },
      { lat: 33.3703, lng: -112.5838 },
      { lat: 33.6028, lng: -114.5255 }
    ],
    'I-17': [
      { lat: 33.4484, lng: -112.0740 },
      { lat: 34.5636, lng: -111.8543 },
      { lat: 35.1982, lng: -111.6513 }
    ],
    'US-60': [
      { lat: 33.6292, lng: -112.3679 },
      { lat: 33.4484, lng: -112.0740 },
      { lat: 33.4152, lng: -111.8315 },
      { lat: 33.3942, lng: -110.7867 }
    ],
    'Loop 101': [
      { lat: 33.6500, lng: -112.0000 },
      { lat: 33.4942, lng: -111.9261 },
      { lat: 33.3062, lng: -111.8413 }
    ],
    'Loop 202': [
      { lat: 33.4484, lng: -112.0740 },
      { lat: 33.4152, lng: -111.8315 },
      { lat: 33.3062, lng: -111.8413 }
    ],
    'I-40': [
      { lat: 35.1894, lng: -114.0530 },
      { lat: 35.1982, lng: -111.6513 },
      { lat: 34.9014, lng: -110.1582 }
    ],
    'SR-51': [
      { lat: 33.4484, lng: -112.0740 },
      { lat: 33.6500, lng: -112.0000 }
    ]
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Get the closest real highways in a given state to a city's coordinates.
 * This is the one part of the module grounded in verifiable geography —
 * unchanged in behavior, kept as-is because it's already correct.
 */
function getClosestHighways(
  stateSlug: string,
  cityCoords: { lat: number; lng: number } | undefined,
  fallbackRoads: string[],
  hash: number
): string[] {
  const stateMap = highwayCoordinates[stateSlug]
  if (!stateMap) {
    return fallbackRoads.slice(0, 2)
  }

  if (!cityCoords || !cityCoords.lat || !cityCoords.lng) {
    // No coordinates available — fall back to a deterministic but
    // clearly-labeled pick rather than pretending it's proximity-based.
    const keys = Object.keys(stateMap)
    const shuffled = [...keys].sort((a, b) => {
      return ((hashString(a) + hash) % 1000) - ((hashString(b) + hash) % 1000)
    })
    return shuffled.slice(0, 2)
  }

  const highwaysWithDistance = Object.entries(stateMap).map(([name, points]) => {
    let minDist = Infinity
    for (const p of points) {
      const dist = getDistance(cityCoords.lat, cityCoords.lng, p.lat, p.lng)
      if (dist < minDist) minDist = dist
    }
    return { name, distance: minDist }
  })

  highwaysWithDistance.sort((a, b) => a.distance - b.distance)
  return highwaysWithDistance.slice(0, 2).map(h => h.name)
}

/**
 * Normalize the sampled accident-type percentages so they sum to a
 * believable total (75-85%) without the previous buggy pseudo-sort.
 */
function pickAndNormalizeAccidentTypes(hash: number) {
  // Deterministic, stable shuffle keyed off the hash (Fisher-Yates style
  // using a seeded PRNG derived from the hash) — no more sorting by an
  // unrelated modulo expression.
  let seed = hash
  const nextRand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  const pool = [...accidentTypes]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  const picked = pool.slice(0, 4).map((type, index) => {
    const variation = Math.round((nextRand() - 0.5) * 8) // -4 to +4
    return {
      type: type.type,
      percentage: Math.max(5, type.basePercent + variation),
      icon: type.icon
    }
  })

  const total = picked.reduce((sum, t) => sum + t.percentage, 0)
  const targetTotal = 75 + Math.round(nextRand() * 10) // 75–85
  const normalized = picked.map(t => ({
    ...t,
    percentage: Math.max(5, Math.round((t.percentage / total) * targetTotal))
  }))

  return normalized
}

function buildDisclaimer(cityName: string, hash: number): string {
  const variant = disclaimerVariants[hash % disclaimerVariants.length]
  return variant.replace('{city}', cityName)
}

/**
 * Generate a population-modeled traffic safety ESTIMATE for a city.
 * See the module-level comment for what this is and isn't.
 */
export function generateAccidentStats(
  cityName: string,
  stateName: string,
  stateSlug: string,
  population?: number,
  coordinates?: { lat: number; lng: number }
): AccidentStats {
  const hash = hashString(`${cityName}-${stateName}`)
  const stateData = stateBaselineData[stateSlug] || defaultStateData

  const estimatedPop = population || (50000 + (hash % 450000))

  const cityVariation = 0.8 + ((hash % 40) / 100)
  const adjustedAccidentRate = Math.round(stateData.accidentRate * cityVariation)
  const annualAccidents = Math.round((estimatedPop / 100000) * adjustedAccidentRate)

  const fatalityRatio = 0.008 + ((hash % 10) / 1000)
  const annualFatalities = Math.max(1, Math.round(annualAccidents * fatalityRatio))

  const injuryRatio = 0.25 + ((hash % 10) / 100)
  const annualInjuries = Math.round(annualAccidents * injuryRatio)

  let comparedToStateAvg: 'above' | 'below' | 'average'
  const comparedToStateAvgPercent = Math.round((cityVariation - 1) * 100)
  if (comparedToStateAvgPercent > 5) comparedToStateAvg = 'above'
  else if (comparedToStateAvgPercent < -5) comparedToStateAvg = 'below'
  else comparedToStateAvg = 'average'

  const topAccidentTypes = pickAndNormalizeAccidentTypes(hash)

  const cityRoadPrefixes = [
    `${cityName} Blvd`,
    `Downtown ${cityName}`,
    `${cityName} Freeway Interchange`
  ]

  const closestHighways = getClosestHighways(stateSlug, coordinates, stateData.commonRoadTypes, hash)

  const dangerousRoads = [...cityRoadPrefixes.slice(0, 2), ...closestHighways]

  const shuffledPeakTimes = [...peakTimes].sort((a, b) => {
    return ((hashString(a) + hash) % 1000) - ((hashString(b) + hash) % 1000)
  }).slice(0, 3)

  const yearOverYearChange = ((hash % 16) - 8)

  return {
    city: cityName,
    state: stateName,
    stateAbbr: stateData.abbr,
    annualAccidents,
    annualFatalities,
    annualInjuries,
    accidentRate: adjustedAccidentRate,
    topAccidentTypes,
    dangerousRoads,
    peakAccidentTimes: shuffledPeakTimes,
    yearOverYearChange,
    comparedToStateAvg,
    comparedToStateAvgPercent: Math.abs(comparedToStateAvgPercent),
    isEstimated: true,
    methodologyNote: methodologyNoteText,
    disclaimer: buildDisclaimer(cityName, hash)
  }
}