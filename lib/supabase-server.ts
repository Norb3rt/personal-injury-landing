import { createClient } from '@supabase/supabase-js'

const clientConfig = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    fetch: (url: any, options: any) => {
      return fetch(url, {
        ...options,
        cache: 'no-store',
      })
    },
  },
}

/**
 * Server-side Supabase client using the service_role_key.
 * ⚠️ ONLY use this for stateless read operations in Server Components.
 * For operations that perform authentication (login, logout, auth checks) 
 * or writes, use createSupabaseServerClient() to avoid cross-request state contamination.
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  clientConfig
)

/**
 * Factory function returning a fresh, un-mutated server client.
 * Bypasses Row-Level Security (RLS) safely on the server side.
 */
export const createSupabaseServerClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  clientConfig
)
