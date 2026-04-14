import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const blocks = await db.availabilityBlock.findMany();
    const confirmedBookings = await db.booking.findMany({
      where: { status: "CONFIRMED" },
      select: { checkIn: true, checkOut: true },
    });
    return NextResponse.json({ blocks, confirmedBookings });
  } catch (error) {
    // Graceful fallback for environments without a database file
    return NextResponse.json({ blocks: [], confirmedBookings: [] });
  }
}
