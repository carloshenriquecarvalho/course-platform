'use client'
import { CardImage } from "../ui/CourseCard"
import { useState } from "react";
import { CourseCardProps } from "@/app/types";
import { useSearchParams } from "next/navigation";
import useFetchData from "@/app/hook/useFetchData";

export default function CourseCardsGroup(){
    const searchParams = useSearchParams();
    const searchTrimming = searchParams.get("search")?.toLowerCase() || ""; 
    
    const { data: courses, loading, error } = useFetchData<CourseCardProps[]>({
        url: "/api/courses/me"
    });

    if(loading) {
        return (
            <h1>Carregando</h1>
        )
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }

    if(!courses || courses.length === 0) {
        return (
            <h1>Você ainda não possui cursos.</h1>
        )
    }

    const filteredCourses = courses.filter((course) => {
        const titleMatch = course.title?.toLowerCase().includes(searchTrimming);
        const descriptionMatch = course.description?.toLowerCase().includes(searchTrimming);
    
        return titleMatch || descriptionMatch;
    });
    
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredCourses.map((course) => {
                return (
                    <CardImage
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    instructor={course.instructor}
                    createdAt={course.createdAt}
                    ></CardImage>
                )}
            )}
        </div>
    )
}