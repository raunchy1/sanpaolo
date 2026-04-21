import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";
import type { FaqItem } from "@/app/api/admin/faq/route";

export async function GET() {
  const items = await readContent<FaqItem[] | null>("faq_items", null);
  return NextResponse.json(items, {
    headers: { "Cache-Control": "no-store" },
  });
}
