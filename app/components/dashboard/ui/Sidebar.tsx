"use client";

import { BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Meus Cursos",
    href: "/dashboard",
    icon: BookOpen,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/auth/login");
  }

  return (
    <aside className="flex flex-col h-full w-64 shrink-0 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
        <div
          className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shrink-0 shadow-md"
          style={{ boxShadow: "0 4px 12px oklch(0.72 0.15 85 / 0.3)" }}
        >
          <span className="text-black font-heading font-bold text-sm">P</span>
        </div>
        <div className="overflow-hidden">
          <p className="font-heading font-semibold text-sm text-white truncate leading-tight">
            Pimenta Estética
          </p>
          <p className="text-[10px] text-white/30 tracking-wide uppercase truncate">
            Plataforma de Cursos
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <p className="text-[10px] font-medium text-white/25 uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-amber-400/12 text-amber-400 border border-amber-400/20"
                  : "text-white/50 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-amber-400" : "text-white/30 group-hover:text-white/70"
                }`}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 py-4 border-t border-white/5 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400/80 hover:bg-red-400/6 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 shrink-0 text-white/25 group-hover:text-red-400/60 transition-colors" />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
