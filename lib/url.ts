// URL builder utilities for consistent URL generation across the app
// This ensures all URLs use the new /personal-injury-lawyer prefix

/**
 * Build a city URL with the personal-injury-lawyer prefix
 * @param state - State slug (e.g., "california", "texas")
 * @param city - City slug (e.g., "los-angeles", "miami")
 * @param practice - Optional practice area slug (e.g., "car-accident")
 * @returns Full URL path with prefix
 */
export function buildCityUrl(state: string, city: string, practice?: string): string {
  const basePath = `/personal-injury-lawyer/${state}/${city}`
  return practice ? `${basePath}/${practice}` : basePath
}

/**
 * Build absolute city URL with domain
 * @param state - State slug
 * @param city - City slug
 * @param practice - Optional practice area slug
 * @param baseUrl - Base domain URL (defaults to NEXT_PUBLIC_DOMAIN)
 * @returns Full absolute URL with domain and prefix
 */
export function buildAbsoluteCityUrl(
  state: string,
  city: string,
  practice?: string,
  baseUrl?: string
): string {
  const domain = baseUrl || process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'
  const path = buildCityUrl(state, city, practice)
  return `${domain}${path}`
}

/**
 * Extract state and city from current pathname
 * Supports both old and new URL structures
 * @param pathname - Current pathname
 * @returns Object with state and city slugs, or null if invalid
 */
export function extractLocationFromPath(pathname: string): { state: string; city: string; practice?: string } | null {
  // Remove leading slash
  const path = pathname.startsWith('/') ? pathname.slice(1) : pathname
  
  // Check if it has the new prefix
  const segments = path.split('/').filter(Boolean)
  
  if (segments[0] === 'personal-injury-lawyer') {
    // New structure: /personal-injury-lawyer/:state/:city(/:practice)?
    return {
      state: segments[1] || '',
      city: segments[2] || '',
      practice: segments[3]
    }
  } else if (segments.length >= 2) {
    // Old structure: /:state/:city(/:practice)?
    return {
      state: segments[0] || '',
      city: segments[1] || '',
      practice: segments[2]
    }
  }
  
  return null
}
