import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client using the service_role_key.
 * ⚠️ ONLY use this in Server Components, API routes, and server actions.
 * NEVER expose this client to the browser — it bypasses all RLS policies.
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
