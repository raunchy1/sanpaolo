import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface Review {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  date: string;
  platform: "airbnb" | "booking" | "google";
  hidden?: boolean;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviews = await readContent<Review[]>("reviews", []);
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // Full replace (reorder / save all)
    if (Array.isArray(body)) {
      await writeContent("reviews", body);
      return NextResponse.json({ success: true });
    }

    // Add single review
    const reviews = await readContent<Review[]>("reviews", []);
    const newReview: Review = {
      id: uuidv4(),
      name: body.name,
      location: body.location || "",
      text: body.text,
      rating: Number(body.rating) || 5,
      date: body.date || new Date().getFullYear().toString(),
      platform: body.platform || "booking",
      hidden: false,
    };
    await writeContent("reviews", [...reviews, newReview]);
    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    const reviews = await readContent<Review[]>("reviews", []);
    const updated = reviews.map((r) => (r.id === id ? { ...r, ...updates } : r));
    await writeContent("reviews", updated);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("Missing id");

    const reviews = await readContent<Review[]>("reviews", []);
    await writeContent("reviews", reviews.filter((r) => r.id !== id));
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
