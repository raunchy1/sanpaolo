import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";
import type { SectionConfig } from "@/app/api/admin/sections/route";

export async function GET() {
  const sections = await readContent<SectionConfig[]>("sections_config", []);
  return NextResponse.json(sections, {
    headers: { "Cache-Control": "no-store" },
  });
}
