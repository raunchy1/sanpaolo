import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { readContent, writeContent } from "@/lib/supabase";

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1).max(10),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    const booking = {
      id: uuidv4(),
      ...data,
      status: "PENDING" as const,
      createdAt: new Date().toISOString(),
    };

    const bookings = await readContent<typeof booking[]>("bookings", []);
    await writeContent("bookings", [...bookings, booking]);

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
