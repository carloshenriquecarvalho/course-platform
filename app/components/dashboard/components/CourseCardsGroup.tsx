'use client'
import { CardImage } from "../ui/CourseCard"
import { useEffect, useState } from "react";
import { CourseCardProps } from "@/app/types";
import { useSearchParams } from "next/navigation";

export default function CourseCardsGroup(){
    const [courses, setCourses] = useState<CourseCardProps[]>([]);
    const searchParams = useSearchParams();
    const searchTrimming = searchParams.get("search")?.toLowerCase() || ""; 

    const filteredCourses = courses.filter((course) => {
    const titleMatch = course.title?.toLowerCase().includes(searchTrimming);
    const descriptionMatch = course.description?.toLowerCase().includes(searchTrimming);
  
  return titleMatch || descriptionMatch;
});

    useEffect(() => {
    async function loadDashborad() {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "/api/courses/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        setCourses(data);
    }

        loadDashborad();
    }, []);
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
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