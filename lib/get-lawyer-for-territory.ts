import { supabaseServer } from '@/lib/supabase-server'

export interface LawyerPublicProfile {
  name: string | null
  location: string | null
  barNumber: string | null
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
          bar_number
        )
      `)
      .eq('cities.slug', paramCity)
      .ilike('cities.state', paramState)
      .in('status', ['active', 'trialing'])
      .limit(1)
      .maybeSingle()

    if (error || !data) return null

    const user = (data as any).users
    return {
      name:      `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || null,
      location:  user.location   ?? null,
      barNumber: user.bar_number ?? null,
    }
  } catch {
    return null
  }
}
