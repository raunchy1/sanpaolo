import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

// Helper — read a JSON blob from site_content
export async function readContent<T>(id: string, fallback: T): Promise<T> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", id)
    .single();

  if (error || !data) return fallback;
  return data.data as T;
}

// Helper — write (upsert) a JSON blob to site_content
export async function writeContent<T>(id: string, value: T): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("site_content").upsert(
    { id, data: value, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) throw new Error(error.message);
}
