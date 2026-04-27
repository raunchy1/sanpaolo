import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";
import type { NavItemConfig } from "@/app/api/admin/navbar/route";

export async function GET() {
  const items = await readContent<NavItemConfig[]>("navbar_config", []);
  return NextResponse.json(items, {
    headers: { "Cache-Control": "no-store" },
  });
}
