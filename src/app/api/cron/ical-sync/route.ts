import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/supabase";
import { randomUUID } from "crypto";
import type { ICalConfig } from "@/app/api/admin/ical/route";

interface AvailabilityBlock {
  id: string;
  date: string;
  reason?: string;
  source?: "manual" | "airbnb" | "booking" | "other";
}

function parseICalDate(raw: string): Date | null {
  const clean = raw.trim();
  const dateOnly = clean.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnly) return new Date(Date.UTC(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3]));
  const dateTime = clean.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (dateTime) return new Date(Date.UTC(+dateTime[1], +dateTime[2] - 1, +dateTime[3]));
  return null;
}

function expandRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  last.setUTCDate(last.getUTCDate() - 1);
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

function parseICal(icsText: string): string[] {
  const dates: string[] = [];
  const lines = icsText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  let inEvent = false, dtstart: Date | null = null, dtend: Date | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { inEvent = true; dtstart = null; dtend = null; continue; }
    if (line === "END:VEVENT") {
      if (inEvent && dtstart && dtend) dates.push(...expandRange(dtstart, dtend));
      inEvent = false; continue;
    }
    if (!inEvent) continue;
    if (line.startsWith("DTSTART")) dtstart = parseICalDate(line.split(":").slice(1).join(":"));
    else if (line.startsWith("DTEND")) dtend = parseICalDate(line.split(":").slice(1).join(":"));
  }
  return [...new Set(dates)];
}

// Called by Vercel Cron — auth via CRON_SECRET header
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await readContent<ICalConfig>("ical_config", { sources: [] });
  if (config.sources.length === 0) {
    return NextResponse.json({ synced: 0, added: 0, ts: new Date().toISOString() });
  }

  const allBlocks = await readContent<AvailabilityBlock[]>("availability", []);
  const manualBlocks = allBlocks.filter((b) => !b.source || b.source === "manual");
  const newBlocks: AvailabilityBlock[] = [];
  let synced = 0;

  for (const source of config.sources) {
    try {
      const res = await fetch(source.url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) continue;
      const dates = parseICal(await res.text());

      for (const dateStr of dates) {
        if (!manualBlocks.some((b) => b.date.slice(0, 10) === dateStr)) {
          newBlocks.push({
            id: randomUUID(),
            date: dateStr + "T00:00:00.000Z",
            reason: source.label,
            source: source.platform === "airbnb" || source.platform === "booking"
              ? source.platform : "other",
          });
        }
      }
      synced++;
    } catch { /* skip failed source */ }
  }

  config.sources = config.sources.map((s) => ({ ...s, lastSync: new Date().toISOString() }));
  await writeContent("ical_config", config);
  await writeContent("availability", [...manualBlocks, ...newBlocks]);

  console.log(`[cron/ical-sync] synced=${synced} added=${newBlocks.length} ts=${new Date().toISOString()}`);
  return NextResponse.json({ synced, added: newBlocks.length, ts: new Date().toISOString() });
}
