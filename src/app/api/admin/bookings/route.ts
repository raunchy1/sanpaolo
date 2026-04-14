import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

const patchSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = patchSchema.parse(body);

    const booking = await db.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 }
    );
  }
}
