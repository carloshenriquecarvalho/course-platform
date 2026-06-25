import { useEffect, useState } from "react";


interface FetchDataProps{
    url: string
}

export default function useFetchData<T>({url}: FetchDataProps){
    const [ data, setData ] = useState<T | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        async function loadData() {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    url,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        signal
                    }
                );

                if(!response.ok) {
                    throw new Error("Erro ao buscar dados");
                }
        
                const result = await response.json();
        
                setData(result);    
            } catch (err: any) {
                if (err.name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Erro desconhecido");
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        }
        
        loadData();

        return () => {
            controller.abort();
        };
    }, [url]);

    return { data, loading, error };
}