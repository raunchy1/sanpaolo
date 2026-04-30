import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";
import type { SiteSettings } from "@/app/api/settings/route";

const NO_CACHE = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await readContent<SiteSettings>("settings", {} as SiteSettings);
    const imageUrl = settings.ogImage?.trim();

    if (imageUrl) {
      return NextResponse.redirect(imageUrl, { headers: NO_CACHE });
    }
  } catch { /* fallback below */ }

  // Absolute fallback — property photo, NOT Trevi
  return NextResponse.redirect(
    new URL("https://sanpaolohideout.it/images/hero-sanpaolo.png"),
    { headers: NO_CACHE }
  );
}
