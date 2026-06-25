"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditCourseForm from "@/app/components/dashboard/components/edit-course/EditCourseForm";
import useFetchData from "@/app/hooks/useFetchData";
import { decodeToken } from "@/app/hooks/useAuth";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);
    const [userAuth, setUserAuth] = useState({ role: "", sub: "" });

    useEffect(() => {
        setTimeout(() => {
            setIsMounted(true);
            const token = localStorage.getItem("token");
            if (token) {
                const payload = decodeToken(token);
                if (payload) {
                    setUserAuth({ role: payload.role, sub: payload.sub });
                }
            }
        }, 0);
    }, []);

    const { data: courseData, loading, error } = useFetchData<any>({
        url: isMounted ? `/api/courses/${id}` : ""
    });

    if (!isMounted || loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
            </div>
        );
    }

    if (error || !courseData) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                <p>Erro ao carregar curso: {error || "Curso não encontrado"}</p>
                <button 
                    onClick={() => router.push("/dashboard")}
                    className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
                >
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }

    // Protect route on client side as fallback
    const isAdmin = userAuth.role === "ADMIN";
    const isOwner = userAuth.role === "INSTRUCTOR" && courseData.instructorId === userAuth.sub;
    
    if (!isAdmin && !isOwner) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                <p>Acesso negado. Você não tem permissão para editar este curso.</p>
                <button 
                    onClick={() => router.push("/dashboard")}
                    className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
                >
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="font-heading text-2xl font-bold text-white">Editar Curso</h1>
                <p className="text-sm text-white/50 mt-1">Atualize as informações, módulos e aulas do curso.</p>
            </div>

            <EditCourseForm initialData={courseData} userAuth={userAuth} />
        </div>
    );
}
