import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";
import type { LegalContent } from "@/app/api/admin/legal/route";

export async function GET() {
  const data = await readContent<LegalContent>("legal_content", { privacy: "", cookie: "" });
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
