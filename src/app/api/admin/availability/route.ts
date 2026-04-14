import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  date: z.string().datetime(),
  reason: z.string().optional(),
});

function normalizeDate(date: Date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { date, reason } = schema.parse(body);

    const block = await db.availabilityBlock.create({
      data: { date: normalizeDate(new Date(date)), reason },
    });

    return NextResponse.json({ success: true, block }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    if (!dateStr) throw new Error("Missing date");

    const date = normalizeDate(new Date(dateStr));

    await db.availabilityBlock.deleteMany({ where: { date } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 }
    );
  }
}
