import { useEffect, useState } from "react";


interface FetchDataProps{
    url: string
}

export default function useFetchData<T>({url}: FetchDataProps){
    const [ data, setData ] = useState<T | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    async function loadData() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if(!response.ok) {
                throw new Error("Erro ao buscar dados");
            }

    
            const result = await response.json();
    
            setData(result);    
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }
        loadData();
    }, [url]);

    return { data, loading, error };
}