import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/supabase";
import { randomUUID } from "crypto";

// Lightweight booking request — used by frontend calendar WhatsApp flow.
// Does NOT require email (user contacts via WhatsApp).
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, checkIn, checkOut, guests, source, notes } = body;

    if (!checkIn || !checkOut) {
      return NextResponse.json({ success: false, error: "Date mancanti" }, { status: 400 });
    }

    const booking = {
      id: randomUUID(),
      name: (name || "Richiesta WhatsApp").trim(),
      email: "",
      phone: body.phone || "",
      checkIn: checkIn.slice(0, 10),
      checkOut: checkOut.slice(0, 10),
      guests: Number(guests) || 1,
      status: "PENDING" as const,
      source: source || "whatsapp",
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    const bookings = await readContent<typeof booking[]>("bookings", []);
    await writeContent("bookings", [...bookings, booking]);

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Errore" }, { status: 400 });
  }
}
