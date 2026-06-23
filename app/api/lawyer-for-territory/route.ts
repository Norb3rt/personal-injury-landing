import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { StateDataLoader } from '@/lib/data/state-loader'

// Cache response for 1 hour — updates automatically when lawyers rent/cancel
export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const stateParam = searchParams.get('state')  // e.g. "california"
  const cityParam  = searchParams.get('city')   // e.g. "los-angeles"

  if (!stateParam || !cityParam) {
    return NextResponse.json({ lawyer: null })
  }

  try {
    const stateConfig = await StateDataLoader.getStateConfig(stateParam)
    const stateAbbr = stateConfig?.abbreviation || stateParam

    // Query: find the active/trialing subscription for this city slug + state
    // Using service_role_key so RLS doesn't block us
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
      .eq('cities.slug', cityParam)
      .ilike('cities.state', stateAbbr)
      .in('status', ['active', 'trialing'])
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[lawyer-for-territory] Supabase error:', error.message)
      return NextResponse.json({ lawyer: null })
    }

    if (!data) {
      return NextResponse.json({ lawyer: null })
    }

    const user = (data as any).users

    return NextResponse.json({
      lawyer: {
        name:      `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || null,
        location:  user.location   ?? null,
        barNumber: user.bar_number ?? null,
      }
    })

  } catch (err) {
    console.error('[lawyer-for-territory] Unexpected error:', err)
    return NextResponse.json({ lawyer: null })
  }
}
