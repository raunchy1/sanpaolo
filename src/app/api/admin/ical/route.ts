import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";
import { randomUUID } from "crypto";

export interface ICalSource {
  id: string;
  label: string;
  url: string;
  platform: "airbnb" | "booking" | "other";
  lastSync?: string;
}

export interface ICalConfig {
  sources: ICalSource[];
}

async function auth() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

export async function GET() {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await readContent<ICalConfig>("ical_config", { sources: [] });
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  // If it's a full sources array, replace config
  if (Array.isArray(body)) {
    await writeContent("ical_config", { sources: body });
    return NextResponse.json({ ok: true });
  }

  // Otherwise it's a single new source
  const { label, url, platform } = body;
  if (!url || !platform) return NextResponse.json({ error: "url e platform richiesti" }, { status: 400 });

  const config = await readContent<ICalConfig>("ical_config", { sources: [] });
  const newSource: ICalSource = {
    id: randomUUID(),
    label: label || platform,
    url,
    platform,
  };
  config.sources.push(newSource);
  await writeContent("ical_config", config);
  return NextResponse.json(newSource, { status: 201 });
}

export async function DELETE(req: Request) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id richiesto" }, { status: 400 });

  const config = await readContent<ICalConfig>("ical_config", { sources: [] });
  config.sources = config.sources.filter((s) => s.id !== id);
  await writeContent("ical_config", config);
  return NextResponse.json({ ok: true });
}
