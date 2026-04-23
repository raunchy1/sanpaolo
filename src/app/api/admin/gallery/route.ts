import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";

export interface GalleryImage {
  src: string;
  alt: string;
  visible: boolean;
  order: number;
}

export interface GalleryRoom {
  id: string;
  label: string;
  images: GalleryImage[];
}

export interface GalleryVideo {
  enabled: boolean;
  url: string;
  title?: string;
}

export interface GalleryConfig {
  rooms: GalleryRoom[];
  video?: GalleryVideo;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await readContent<GalleryConfig | null>("gallery_config", null);
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.rooms)) throw new Error("Invalid payload");
    await writeContent("gallery_config", body);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
