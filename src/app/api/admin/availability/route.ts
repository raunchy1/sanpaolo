import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface AvailabilityBlock {
  id: string;
  date: string;
  reason?: string;
}

function normalizeDate(dateStr: string): string {
  const d = new Date(dateStr);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .split("T")[0];
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { date, reason } = await req.json();
    const normalized = normalizeDate(date);

    const blocks = await readContent<AvailabilityBlock[]>("availability", []);
    if (blocks.some((b) => b.date === normalized)) {
      return NextResponse.json({ success: true, message: "already blocked" });
    }

    const newBlock: AvailabilityBlock = { id: uuidv4(), date: normalized, reason };
    await writeContent("availability", [...blocks, newBlock]);
    return NextResponse.json({ success: true, block: newBlock }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    if (!dateStr) throw new Error("Missing date");

    const normalized = normalizeDate(dateStr);
    const blocks = await readContent<AvailabilityBlock[]>("availability", []);
    const updated = blocks.filter((b) => b.date !== normalized);
    await writeContent("availability", updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
