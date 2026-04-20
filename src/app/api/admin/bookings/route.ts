import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";
import { randomUUID } from "crypto";

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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, email, phone, checkIn, checkOut, guests, status, notes } = body;

    if (!name || !email || !checkIn || !checkOut || !guests) {
      throw new Error("Campi obbligatori mancanti");
    }

    const newBooking: Booking = {
      id: randomUUID(),
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || undefined,
      checkIn,
      checkOut,
      guests: Number(guests),
      status: (status as BookingStatus) || "CONFIRMED",
      notes: notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const bookings = await readContent<Booking[]>("bookings", []);
    await writeContent("bookings", [...bookings, newBooking]);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status, name, email, phone, checkIn, checkOut, guests, notes } = body;

    if (!id) throw new Error("ID mancante");

    const bookings = await readContent<Booking[]>("bookings", []);
    const updated = bookings.map((b) => {
      if (b.id !== id) return b;
      return {
        ...b,
        ...(status && { status: status as BookingStatus }),
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone: phone || undefined }),
        ...(checkIn !== undefined && { checkIn }),
        ...(checkOut !== undefined && { checkOut }),
        ...(guests !== undefined && { guests: Number(guests) }),
        ...(notes !== undefined && { notes: notes || undefined }),
      };
    });
    await writeContent("bookings", updated);

    const booking = updated.find((b) => b.id === id);
    return NextResponse.json({ success: true, booking });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID mancante");

    const bookings = await readContent<Booking[]>("bookings", []);
    await writeContent("bookings", bookings.filter((b) => b.id !== id));

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
