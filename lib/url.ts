// URL builder utilities for consistent URL generation across the app
// This ensures all URLs use the new /personal-injury-lawyer prefix

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
  const basePath = `/personal-injury-lawyer/${state}/${city}`
  const path = practice ? `${basePath}/${practice}` : basePath
  return `${domain}${path}`
}
