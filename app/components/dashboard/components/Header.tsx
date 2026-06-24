import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef } from "react";

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
            <>
                <header className="h-16 w-full shrink-0 border-b flex items-center px-6">
                <input 
                    type="text" 
                    placeholder="Buscar cursos..." 
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("search")?.toString()}
                    className="w-full max-w-md px-4 py-2 rounded border"/>
                </header>
            </>
        )
}