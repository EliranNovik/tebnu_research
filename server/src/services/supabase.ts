import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import ws from "ws";


let client: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase server configuration is missing.");
  }
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { transport: ws as never },
    });
  }
  return client;
}
