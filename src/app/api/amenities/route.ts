import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";
import { DEFAULT_CONFIG, type AmenitiesConfig } from "../admin/amenities/route";

export async function GET() {
  const config = await readContent<AmenitiesConfig>("amenities_config", DEFAULT_CONFIG);
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}
