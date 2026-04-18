import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await readContent<Booking[]>("bookings", []);
  return NextResponse.json(
    [...bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status } = await req.json();
    if (!id || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      throw new Error("Invalid data");
    }

    const bookings = await readContent<Booking[]>("bookings", []);
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    await writeContent("bookings", updated);

    const booking = updated.find((b) => b.id === id);
    return NextResponse.json({ success: true, booking });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
