import { createClient } from '@supabase/supabase-js';

// Chaves publicáveis (seguras para o frontend). As variáveis de ambiente têm prioridade.
const FALLBACK_URL = "https://ibickxigovgcwwsqfpeb.supabase.co";
const FALLBACK_ANON_KEY = "sb_publishable_ujOgrDJiP7ITpMRtfYRfuw_WagffxIl";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

// If for any reason both values are still falsy, alert the developer.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "🚨 Supabase URL or ANON KEY not configured. Check .env or environment variables."
  );
  throw new Error("Supabase configuration missing");
}

// Initialise the real Supabase client – no mock fallback.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
