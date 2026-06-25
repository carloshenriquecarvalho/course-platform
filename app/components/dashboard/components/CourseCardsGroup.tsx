'use client'
import { CardImage } from "../ui/CourseCard"
import { CourseCardProps } from "@/app/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import useFetchData from "@/app/hooks/useFetchData";
import { decodeToken } from "@/app/hooks/useAuth";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import EmptyState from "@/app/components/ui/EmptyState";
import { BookX } from "lucide-react";

export default function CourseCardsGroup(){
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchTrimming = searchParams.get("search")?.toLowerCase() || ""; 
    
    // Auth context
    const [userAuth] = useState(() => {
        if (typeof window === "undefined") return { role: "", sub: "" };
        const token = localStorage.getItem("token");
        if (!token) return { role: "", sub: "" };
        const payload = decodeToken(token);
        if (!payload) return { role: "", sub: "" };
        return { role: payload.role, sub: payload.sub };
    });

    const { data: courses, loading, error } = useFetchData<CourseCardProps[]>({
        url: "/api/courses/me"
    });

    function handleEdit(id: string) {
        router.push(`/dashboard/edit-course/${id}`);
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este curso? Esta ação é irreversível e apagará todos os módulos e aulas.")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/courses/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (res.ok) {
                window.location.reload(); // Quick refresh to reflect deletion
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(`Erro ao excluir: ${errData.message || "desconhecido"}`);
            }
        } catch (err) {
            alert(`Erro ao conectar com o servidor. ${err}`);
        }
    }

    if(loading) {
        return (
            <LoadingSpinner size="md" text="Carregando seus cursos..." />
        )
    }

    if (error) {
        return (
            <EmptyState
                title="Não foi possível carregar"
                description={`Ocorreu um erro ao buscar seus cursos: ${error}`}
                icon={<BookX className="w-7 h-7 text-red-400/60" />}
            />
        );
    }

    if(!courses || courses.length === 0) {
        return (
            <EmptyState
                title="Você ainda não possui cursos"
                description="Quando você se matricular em um curso, ele aparecerá aqui."
            />
        )
    }

    const filteredCourses = courses.filter((course) => {
        const titleMatch = course.title?.toLowerCase().includes(searchTrimming);
        const descriptionMatch = course.description?.toLowerCase().includes(searchTrimming);
    
        return titleMatch || descriptionMatch;
    });

    if (filteredCourses.length === 0) {
        return (
            <EmptyState
                title="Nenhum curso encontrado"
                description={`Não encontramos cursos para "${searchTrimming}".`}
            />
        );
    }
    
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
            {filteredCourses.map((course) => {
                const canDelete = 
                    userAuth.role === "ADMIN" || 
                    (userAuth.role === "INSTRUCTOR" && course.instructor.id === userAuth.sub);

                return (
                    <CardImage
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        instructor={course.instructor}
                        createdAt={course.createdAt}
                        progress={course.progress}
                        status={course.status}
                        canDelete={canDelete}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                )}
            )}
        </div>
    )
}