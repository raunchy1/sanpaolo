import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";

interface AvailabilityBlock {
  id: string;
  date: string;
  reason?: string;
}

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

export async function GET() {
  try {
    const [blocks, bookings] = await Promise.all([
      readContent<AvailabilityBlock[]>("availability", []),
      readContent<Booking[]>("bookings", []),
    ]);
    const confirmedBookings = bookings
      .filter((b) => b.status === "CONFIRMED")
      .map((b) => ({ checkIn: b.checkIn, checkOut: b.checkOut }));
    return NextResponse.json({ blocks, confirmedBookings }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ blocks: [], confirmedBookings: [] });
  }
}
