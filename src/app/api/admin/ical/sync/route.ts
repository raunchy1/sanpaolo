import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";
import { randomUUID } from "crypto";
import type { ICalConfig } from "../route";

interface AvailabilityBlock {
  id: string;
  date: string;
  reason?: string;
  source?: "manual" | "airbnb" | "booking" | "other";
}

function parseICalDate(raw: string): Date | null {
  const clean = raw.trim();
  // VALUE=DATE:YYYYMMDD
  const dateOnly = clean.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnly) {
    return new Date(Date.UTC(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3]));
  }
  // YYYYMMDDTHHMMSSz
  const dateTime = clean.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (dateTime) {
    return new Date(Date.UTC(+dateTime[1], +dateTime[2] - 1, +dateTime[3]));
  }
  return null;
}

function expandRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  // DTEND is exclusive (checkout day not blocked)
  const last = new Date(end);
  last.setUTCDate(last.getUTCDate() - 1);
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

function parseICal(icsText: string, platform: string): string[] {
  const dates: string[] = [];
  const lines = icsText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  let inEvent = false;
  let dtstart: Date | null = null;
  let dtend: Date | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { inEvent = true; dtstart = null; dtend = null; continue; }
    if (line === "END:VEVENT") {
      if (inEvent && dtstart && dtend) {
        dates.push(...expandRange(dtstart, dtend));
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    if (line.startsWith("DTSTART")) {
      const val = line.split(":").slice(1).join(":");
      dtstart = parseICalDate(val);
    } else if (line.startsWith("DTEND")) {
      const val = line.split(":").slice(1).join(":");
      dtend = parseICalDate(val);
    }
  }

  void platform;
  return [...new Set(dates)];
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await readContent<ICalConfig>("ical_config", { sources: [] });
  if (config.sources.length === 0) {
    return NextResponse.json({ synced: 0, added: 0 });
  }

  const allBlocks = await readContent<AvailabilityBlock[]>("availability", []);
  // Remove blocks from external sources (they'll be re-added)
  const manualBlocks = allBlocks.filter(
    (b) => !b.source || b.source === "manual"
  );

  const newBlocks: AvailabilityBlock[] = [];
  let synced = 0;

  for (const source of config.sources) {
    try {
      const res = await fetch(source.url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const icsText = await res.text();
      const dates = parseICal(icsText, source.platform);

      for (const dateStr of dates) {
        // Skip if manually blocked already
        const alreadyManual = manualBlocks.some((b) => b.date.slice(0, 10) === dateStr);
        if (!alreadyManual) {
          newBlocks.push({
            id: randomUUID(),
            date: dateStr + "T00:00:00.000Z",
            reason: source.label,
            source: source.platform === "airbnb" || source.platform === "booking"
              ? source.platform
              : "other",
          });
        }
      }
      synced++;
    } catch {
      // Skip failed sources
    }
  }

  // Update lastSync on all sources
  config.sources = config.sources.map((s) => ({ ...s, lastSync: new Date().toISOString() }));
  await writeContent("ical_config", config);

  const combined = [...manualBlocks, ...newBlocks];
  await writeContent("availability", combined);

  return NextResponse.json({ synced, added: newBlocks.length });
}
