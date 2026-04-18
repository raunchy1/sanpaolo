import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";

export async function GET() {
  try {
    const overrides = await readContent("overrides", { it: {}, en: {}, de: {} });
    return NextResponse.json(overrides, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ it: {}, en: {}, de: {} });
  }
}
