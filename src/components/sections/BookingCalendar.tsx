"use client";

import { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { it } from "date-fns/locale";
import { format, differenceInDays, addDays } from "date-fns";
import { CalendarDays, Users, ArrowRight, MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import "react-day-picker/style.css";

interface AvailabilityBlock { id: string; date: string; }
interface ConfirmedBooking { checkIn: string; checkOut: string; }

function toLocalMidnight(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function expandBookingDates(bookings: ConfirmedBooking[]): Date[] {
  const dates: Date[] = [];
  for (const b of bookings) {
    const start = toLocalMidnight(b.checkIn);
    const end = toLocalMidnight(b.checkOut);
    const nights = differenceInDays(end, start);
    for (let i = 0; i < nights; i++) {
      dates.push(addDays(start, i));
    }
  }
  return dates;
}

export default function BookingCalendar() {
  const settings = useSettings();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [confirmedDates, setConfirmedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => {
        const blocks: Date[] = (data.blocks || []).map((b: AvailabilityBlock) =>
          toLocalMidnight(b.date.slice(0, 10))
        );
        const confirmed = expandBookingDates(data.confirmedBookings || []);
        setBlockedDates(blocks);
        setConfirmedDates(confirmed);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allDisabled = [...blockedDates, ...confirmedDates];

  const nights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;

  function openWhatsApp() {
    if (!range?.from || !range?.to) return;
    const checkIn = format(range.from, "d MMMM yyyy", { locale: it });
    const checkOut = format(range.to, "d MMMM yyyy", { locale: it });
    const msg = `Ciao! Vorrei richiedere una prenotazione:

📅 Check-in: ${checkIn}
📅 Check-out: ${checkOut}
🌙 Notti: ${nights}
👥 Ospiti: ${guests}

Potete confermare la disponibilità?`;

    const phone = (settings?.whatsapp || settings?.phone || "").replace(/\D/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    // Save request in background
    fetch("/api/bookings/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkIn: format(range.from, "yyyy-MM-dd"),
        checkOut: format(range.to, "yyyy-MM-dd"),
        guests,
        source: "whatsapp",
      }),
    }).catch(() => {});

    window.open(url, "_blank");
  }

  return (
    <section className="py-20 bg-white" id="prenota">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#072316]/8 text-[#072316] text-sm font-medium mb-4">
            <CalendarDays className="w-4 h-4" />
            Disponibilità in tempo reale
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Controlla le date
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Seleziona le date del tuo soggiorno e contattaci su WhatsApp per confermare.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Calendar */}
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-8">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex justify-center">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  locale={it}
                  numberOfMonths={2}
                  disabled={[
                    { before: new Date() },
                    ...allDisabled,
                  ]}
                  modifiers={{
                    booked: allDisabled,
                  }}
                  modifiersClassNames={{
                    booked: "!bg-red-100 !text-red-400 line-through cursor-not-allowed",
                  }}
                  classNames={{
                    today: "font-bold",
                    selected: "!bg-[#072316] !text-white !rounded-md",
                    range_start: "!bg-[#072316] !text-white !rounded-l-md",
                    range_end: "!bg-[#072316] !text-white !rounded-r-md",
                    range_middle: "!bg-[#072316]/10 !text-[#072316] !rounded-none",
                  }}
                />
              </div>
            )}
            <div className="flex items-center gap-6 mt-4 text-xs text-gray-500 justify-center">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#072316]" />
                Selezionato
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-100 line-through" />
                Non disponibile
              </span>
            </div>
          </div>

          {/* Summary panel */}
          <div className="bg-gray-50 rounded-3xl p-6 space-y-5">
            <h3 className="font-semibold text-gray-900">Il tuo soggiorno</h3>

            {/* Dates */}
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100">
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Check-in</div>
                  <div className="text-sm font-medium text-gray-900">
                    {range?.from
                      ? format(range.from, "d MMM yyyy", { locale: it })
                      : "—"}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-0.5">Check-out</div>
                  <div className="text-sm font-medium text-gray-900">
                    {range?.to
                      ? format(range.to, "d MMM yyyy", { locale: it })
                      : "—"}
                  </div>
                </div>
              </div>

              {nights > 0 && (
                <div className="text-center text-sm text-[#072316] font-medium">
                  {nights} {nights === 1 ? "notte" : "notti"}
                </div>
              )}
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium">
                <Users className="inline w-3.5 h-3.5 mr-1" />
                Ospiti
              </label>
              <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
                >
                  −
                </button>
                <span className="flex-1 text-center font-semibold text-gray-900">{guests}</span>
                <button
                  onClick={() => setGuests((g) => Math.min(10, g + 1))}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={openWhatsApp}
              disabled={!range?.from || !range?.to}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Richiedi su WhatsApp
            </button>

            {!range?.from && (
              <p className="text-center text-xs text-gray-400">
                Seleziona le date sul calendario per continuare
              </p>
            )}

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Risposta entro poche ore · Nessun pagamento anticipato richiesto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
