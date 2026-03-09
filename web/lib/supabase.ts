const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabase() {
  if (typeof window === "undefined" || !url || !key) return null;
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, key);
}

export const supabase =
  typeof window !== "undefined" && url && key ? getSupabase() : null;
