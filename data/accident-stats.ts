/**
 * Accident Statistics Data Generator
 * 
 * Generates realistic, unique accident statistics for each city
 * based on population, state data, and deterministic algorithms.
 * 
 * Data sources referenced (for realistic ranges):
 * - NHTSA Fatality Analysis Reporting System (FARS)
 * - State DOT annual reports
 * - Insurance Institute for Highway Safety (IIHS)
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
}

// State-level baseline data (realistic ranges based on NHTSA data)
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

// Default for states not explicitly defined
const defaultStateData = {
  abbr: 'US',
  fatalityRate: 12.5,
  accidentRate: 800,
  commonRoadTypes: ['Interstate Highway', 'State Route', 'US Highway', 'County Road']
}

// Common accident types with realistic national percentages
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

// Peak accident times
const peakTimes = [
  'Friday 4-7 PM (Rush Hour)',
  'Saturday 12-3 AM (Late Night)',
  'Monday 7-9 AM (Morning Commute)',
  'Holiday Weekends',
  'Rainy/Wet Conditions'
]

/**
 * Generate a deterministic hash from a string
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Generate accident statistics for a specific city
 */
export function generateAccidentStats(
  cityName: string,
  stateName: string,
  stateSlug: string,
  population?: number
): AccidentStats {
  const hash = hashString(`${cityName}-${stateName}`)
  const stateData = stateBaselineData[stateSlug] || defaultStateData
  
  // Estimate population if not provided (based on hash for consistency)
  const estimatedPop = population || (50000 + (hash % 450000))
  
  // Calculate base accident rate with city-specific variation (+/- 20%)
  const cityVariation = 0.8 + ((hash % 40) / 100) // 0.8 to 1.2
  const adjustedAccidentRate = Math.round(stateData.accidentRate * cityVariation)
  
  // Calculate annual accidents based on population
  const annualAccidents = Math.round((estimatedPop / 100000) * adjustedAccidentRate)
  
  // Calculate fatalities (typically 1-2% of accidents result in fatalities)
  const fatalityRatio = 0.008 + ((hash % 10) / 1000) // 0.8% to 1.8%
  const annualFatalities = Math.max(1, Math.round(annualAccidents * fatalityRatio))
  
  // Calculate injuries (typically 25-35% of accidents result in injuries)
  const injuryRatio = 0.25 + ((hash % 10) / 100) // 25% to 35%
  const annualInjuries = Math.round(annualAccidents * injuryRatio)
  
  // Determine comparison to state average
  let comparedToStateAvg: 'above' | 'below' | 'average'
  const comparedToStateAvgPercent = Math.round((cityVariation - 1) * 100)
  
  if (comparedToStateAvgPercent > 5) {
    comparedToStateAvg = 'above'
  } else if (comparedToStateAvgPercent < -5) {
    comparedToStateAvg = 'below'
  } else {
    comparedToStateAvg = 'average'
  }
  
  // Generate top accident types with variation
  const shuffledTypes = [...accidentTypes].sort((a, b) => {
    return ((a.basePercent + hash) % 50) - ((b.basePercent + hash) % 50)
  })
  
  const topAccidentTypes = shuffledTypes.slice(0, 4).map((type, index) => {
    // Vary percentages slightly based on city hash
    const variation = ((hash + index * 7) % 8) - 4 // -4 to +4
    return {
      type: type.type,
      percentage: Math.max(5, type.basePercent + variation),
      icon: type.icon
    }
  })
  
  // Normalize percentages to sum closer to 75-85%
  const totalPercent = topAccidentTypes.reduce((sum, t) => sum + t.percentage, 0)
  const targetTotal = 75 + (hash % 10)
  topAccidentTypes.forEach(t => {
    t.percentage = Math.round((t.percentage / totalPercent) * targetTotal)
  })
  
  // Generate dangerous roads for this city
  const cityRoadPrefixes = [
    `${cityName} Blvd`,
    `Downtown ${cityName}`,
    `${cityName} Freeway Interchange`
  ]
  
  const stateRoads = stateData.commonRoadTypes.slice(0, 3)
  const dangerousRoads = [
    ...cityRoadPrefixes.slice(0, 2),
    ...stateRoads.slice(0, 2)
  ]
  
  // Shuffle peak times based on city
  const shuffledPeakTimes = [...peakTimes].sort((a, b) => {
    return ((a.length + hash) % 20) - ((b.length + hash) % 20)
  }).slice(0, 3)
  
  // Year over year change (-8% to +8%)
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
    comparedToStateAvgPercent: Math.abs(comparedToStateAvgPercent)
  }
}
