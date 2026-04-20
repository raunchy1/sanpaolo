import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) throw new Error("Nessun file ricevuto");

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `gallery/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage
      .from("gallery")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filename);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore upload";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
