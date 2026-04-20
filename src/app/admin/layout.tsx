"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  FileText,
  Settings,
  Star,
  Layers,
  LogOut,
  Home,
  Images,
  Palette,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/prenotazioni", label: "Prenotazioni", icon: BookOpen },
  { href: "/admin/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/admin/contenuti", label: "Contenuti", icon: FileText },
  { href: "/admin/sezioni", label: "Sezioni", icon: Layers },
  { href: "/admin/galleria", label: "Galleria foto", icon: Images },
  { href: "/admin/recensioni", label: "Recensioni", icon: Star },
  { href: "/admin/impostazioni", label: "Impostazioni", icon: Settings },
  { href: "/admin/design", label: "Design", icon: Palette },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#072316] flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="text-white font-bold text-base leading-tight">San Paolo Hideout</div>
          <div className="text-white/50 text-xs mt-0.5">Pannello Admin</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-white/10 pt-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all"
          >
            <Home className="w-4 h-4" />
            Vedi sito
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            Esci
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
