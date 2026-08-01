import { createClient } from "@supabase/supabase-js";

/**
 * Public Supabase client.
 *
 * ONLY the URL + anon key are used here (both safe in client code:
 * they are designed to be public and are governed by RLS policies
 * on the database side). The service-role key is NEVER imported
 * into anything under src/ — see scripts/seed.ts for the only
 * legitimate server-side use.
 *
 * Throws early if env vars are missing — better than silently
 * shipping a broken app to a deployment.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Nirog] Supabase env vars missing — copy .env.example to .env.local",
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});
