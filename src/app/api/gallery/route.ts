import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";
import type { GalleryConfig } from "@/app/api/admin/gallery/route";

export async function GET() {
  const config = await readContent<GalleryConfig | null>("gallery_config", null);
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}
