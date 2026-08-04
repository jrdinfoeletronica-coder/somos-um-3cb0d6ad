import { createClient } from '@supabase/supabase-js';

// Use environment variables with hard‑coded fallbacks for development and production.
// The logical OR (||) also covers empty strings.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ibickxigovgcwwsqfpeb.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_ujOgrDJiP7ITpMRtfYRfuw_WagffxIl";

// If for any reason both values are still falsy, alert the developer.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "🚨 Supabase URL or ANON KEY not configured. Check .env or environment variables."
  );
  throw new Error("Supabase configuration missing");
}

// Initialise the real Supabase client – no mock fallback.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
