"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions";

const TABS = [
  { href: "/participantes", label: "Participantes" },
  { href: "/por-sr", label: "Por SR" },
  { href: "/movimientos", label: "Últimos movimientos" },
];

export default function NavBar({ nombreUsuario }: { nombreUsuario: string }) {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="font-bold text-indigo-700 text-lg">WKNDS</span>
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <Link key={tab.href} href={tab.href}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  pathname === tab.href ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                }`}>
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{nombreUsuario}</span>
          <form action={logout}>
            <button type="submit" className="btn-ghost text-sm">Salir</button>
          </form>
        </div>
      </div>
    </header>
  );
}