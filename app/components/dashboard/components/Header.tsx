"use client";

import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Search } from "lucide-react";

export default function Header() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    
    function handleSearch(term: string) {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(() => {
            const params: URLSearchParams = new URLSearchParams(searchParams);
            if(term) {
                params.set("search", term);
            } else{
                params.delete("search");
            }
            replace(`${pathname}?${params.toString()}`);

        }, 300)
        
    }

    return (
        <header className="h-16 w-full shrink-0 border-b border-white/5 flex items-center px-6 gap-4 bg-sidebar/80 backdrop-blur-sm">
            {/* Search bar */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Buscar cursos..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("search")?.toString()}
                    className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/40 focus:bg-white/7 transition-all duration-200"
                />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* User badge */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center shrink-0"
                    style={{ boxShadow: "0 2px 8px oklch(0.72 0.15 85 / 0.3)" }}>
                    <span className="text-black font-heading font-bold text-xs">U</span>
                </div>
            </div>
        </header>
    )
}