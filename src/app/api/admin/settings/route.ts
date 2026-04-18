import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/app/api/settings/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await readContent<SiteSettings>("settings", DEFAULT_SETTINGS);
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const current = await readContent<SiteSettings>("settings", DEFAULT_SETTINGS);
    const updated = { ...current, ...body };
    await writeContent("settings", updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
