'use client'
import { CardImage } from "../ui/CourseCard"
import { CourseCardProps } from "@/app/types";
import { useSearchParams } from "next/navigation";
import useFetchData from "@/app/hooks/useFetchData";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import EmptyState from "@/app/components/ui/EmptyState";
import { BookX } from "lucide-react";

export default function CourseCardsGroup(){
    const searchParams = useSearchParams();
    const searchTrimming = searchParams.get("search")?.toLowerCase() || ""; 
    
    const { data: courses, loading, error } = useFetchData<CourseCardProps[]>({
        url: "/api/courses/me"
    });

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
                return (
                    <CardImage
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    instructor={course.instructor}
                    createdAt={course.createdAt}
                    progress={course.progress}
                    ></CardImage>
                )}
            )}
        </div>
    )
}