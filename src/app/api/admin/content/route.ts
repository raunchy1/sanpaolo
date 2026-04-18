import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";

type Overrides = Record<string, Record<string, unknown>>;

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(
        (target[key] as Record<string, unknown>) || {},
        source[key] as Record<string, unknown>
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const overrides = await readContent<Overrides>("overrides", { it: {}, en: {}, de: {} });
  return NextResponse.json(overrides);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const current = await readContent<Overrides>("overrides", { it: {}, en: {}, de: {} });
    const updated: Overrides = {
      it: deepMerge(current.it || {}, body.it || {}),
      en: deepMerge(current.en || {}, body.en || {}),
      de: deepMerge(current.de || {}, body.de || {}),
    };
    await writeContent("overrides", updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
