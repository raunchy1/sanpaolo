import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const OVERRIDES_PATH = join(process.cwd(), "data", "site-overrides.json");

function readOverrides() {
  try {
    return JSON.parse(readFileSync(OVERRIDES_PATH, "utf-8"));
  } catch {
    return { it: {}, en: {}, de: {} };
  }
}

function writeOverrides(data: object) {
  mkdirSync(dirname(OVERRIDES_PATH), { recursive: true });
  writeFileSync(OVERRIDES_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readOverrides());
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const current = readOverrides();
    const updated = {
      ...current,
      it: deepMerge(current.it || {}, body.it || {}),
      en: deepMerge(current.en || {}, body.en || {}),
      de: deepMerge(current.de || {}, body.de || {}),
    };
    writeOverrides(updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
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
