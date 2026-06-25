'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function decodeToken(token: string) {
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string) {
    const payload = decodeToken(token);
    if (!payload) return true;
    return payload.exp * 1000 < Date.now();
}

export function useAuth() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return router.replace("/auth/login");
        }
        if (isTokenExpired(token)) {
            localStorage.removeItem("token");
            return router.replace("/auth/login");
        }
    }, [router]);
}