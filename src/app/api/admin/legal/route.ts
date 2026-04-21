import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";

export interface LegalContent {
  privacy: string;
  cookie: string;
}

const DEFAULT: LegalContent = { privacy: "", cookie: "" };

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await readContent<LegalContent>("legal_content", DEFAULT);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json() as Partial<LegalContent>;
    const current = await readContent<LegalContent>("legal_content", DEFAULT);
    await writeContent("legal_content", { ...current, ...body });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}
