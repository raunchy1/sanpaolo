import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, CalendarDays, FileText, Clock, Star, Images } from "lucide-react";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface Booking {
  id: string;
  name: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: BookingStatus;
  createdAt: string;
}

interface AvailabilityBlock { id: string; date: string; }
interface Review { id: string; hidden?: boolean; }
interface GalleryRoom { images: { visible: boolean }[]; }
interface GalleryConfig { rooms: GalleryRoom[]; }

async function getStats() {
  try {
    const [bookings, blocks, reviews, gallery] = await Promise.all([
      readContent<Booking[]>("bookings", []),
      readContent<AvailabilityBlock[]>("availability", []),
      readContent<Review[]>("reviews", []),
      readContent<GalleryConfig>("gallery_config", { rooms: [] }),
    ]);
    const visiblePhotos = gallery.rooms?.reduce(
      (sum: number, r: GalleryRoom) => sum + (r.images?.filter((i) => i.visible).length ?? 0), 0
    ) ?? 0;
    return {
      pending: bookings.filter((b) => b.status === "PENDING").length,
      confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
      blocks: blocks.length,
      reviews: reviews.filter((r) => !r.hidden).length,
      photos: visiblePhotos,
      recent: bookings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    };
  } catch {
    return { pending: 0, confirmed: 0, blocks: 0, reviews: 0, photos: 0, recent: [] };
  }
}

function statusBadge(status: BookingStatus) {
  const map: Record<BookingStatus, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-700",
  };
  const label: Record<BookingStatus, string> = {
    PENDING: "In attesa",
    CONFIRMED: "Confermata",
    CANCELLED: "Annullata",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const stats = await getStats();

  const cards = [
    { label: "In attesa",       value: stats.pending,   icon: Clock,        href: "/admin/prenotazioni", color: "text-amber-600 bg-amber-50" },
    { label: "Confermate",      value: stats.confirmed, icon: BookOpen,     href: "/admin/prenotazioni", color: "text-green-700 bg-green-50" },
    { label: "Date bloccate",   value: stats.blocks,    icon: CalendarDays, href: "/admin/calendario",   color: "text-blue-700 bg-blue-50" },
    { label: "Recensioni live", value: stats.reviews,   icon: Star,         href: "/admin/recensioni",   color: "text-purple-700 bg-purple-50" },
    { label: "Foto visibili",   value: stats.photos,    icon: Images,       href: "/admin/galleria",     color: "text-rose-700 bg-rose-50" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Benvenuto</h1>
        <p className="text-gray-500 text-sm mt-1">Ecco un riepilogo della situazione attuale.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${card.color} mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Ultime prenotazioni</h2>
          <Link href="/admin/prenotazioni" className="text-sm text-[#072316] hover:underline">
            Vedi tutte →
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <p className="text-gray-400 text-sm py-6 text-center">Nessuna prenotazione ancora.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recent.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate">{b.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(b.checkIn).toLocaleDateString("it-IT")} →{" "}
                    {new Date(b.checkOut).toLocaleDateString("it-IT")} · {b.guests}{" "}
                    {b.guests === 1 ? "ospite" : "ospiti"}
                  </div>
                </div>
                {statusBadge(b.status)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: "/admin/calendario",   icon: CalendarDays, title: "Disponibilità",   sub: "Blocca o sblocca date" },
          { href: "/admin/contenuti",    icon: FileText,     title: "Contenuti",        sub: "Testi, FAQ, offerte" },
          { href: "/admin/recensioni",   icon: Star,         title: "Recensioni",       sub: "Gestisci recensioni" },
          { href: "/admin/impostazioni", icon: Images,       title: "Impostazioni",     sub: "Contatti, SEO, link" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="p-2.5 rounded-xl bg-[#072316]/8 text-[#072316] shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">{item.title}</div>
              <div className="text-xs text-gray-400 truncate">{item.sub}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
