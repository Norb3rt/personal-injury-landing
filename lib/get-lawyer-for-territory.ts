import { supabaseServer } from '@/lib/supabase-server'
import { StateDataLoader } from '@/lib/data/state-loader'

export interface LawyerPublicProfile {
  name: string | null
  location: string | null
  barNumber: string | null
  streetAddress?: string | null
  suiteUnit?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
}

/**
 * Fetches the lawyer who has rented the given city territory.
 * Uses service_role_key (server-side only) to bypass RLS.
 * Returns null if no active/trialing subscription is found.
 *
 * Shared by:
 *   - app/personal-injury-lawyer/[state]/[city]/page.tsx
 *   - app/personal-injury-lawyer/[state]/[city]/[practice]/page.tsx
 */
export async function getLawyerForTerritory(
  paramState: string,
  paramCity: string
): Promise<LawyerPublicProfile | null> {
  try {
    const stateConfig = await StateDataLoader.getStateConfig(paramState)
    const stateAbbr = stateConfig?.abbreviation || paramState

    const { data, error } = await supabaseServer
      .from('territory_subscriptions')
      .select(`
        status,
        cities!inner (
          slug,
          state
        ),
        users!inner (
          first_name,
          last_name,
          location,
          bar_number,
          street_address,
          suite_unit,
          city,
          state,
          zip_code
        )
      `)
      .eq('cities.slug', paramCity)
      .ilike('cities.state', stateAbbr)
      .in('status', ['active', 'trialing'])
      .limit(1)
      .maybeSingle()

    if (error || !data) return null

    const user = (data as any).users
    return {
      name:      `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || null,
      location:  user.location   ?? null,
      barNumber: user.bar_number ?? null,
      streetAddress: user.street_address ?? null,
      suiteUnit: user.suite_unit ?? null,
      city: user.city ?? null,
      state: user.state ?? null,
      zipCode: user.zip_code ?? null,
    }
  } catch {
    return null
  }
}
