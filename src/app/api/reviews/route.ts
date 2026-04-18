import { NextResponse } from "next/server";
import { readContent } from "@/lib/supabase";

export interface PublicReview {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  date: string;
  platform: "airbnb" | "booking" | "google";
}

interface StoredReview extends PublicReview {
  hidden?: boolean;
}

export async function GET() {
  const reviews = await readContent<StoredReview[]>("reviews", []);
  const visible = reviews.filter((r) => !r.hidden);
  return NextResponse.json(visible, {
    headers: { "Cache-Control": "no-store" },
  });
}
