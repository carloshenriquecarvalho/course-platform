'use client'
import { useEffect, useState } from "react" 
import { CourseCardProps } from "../types";
import { CardImage } from "../components/CourseCard";

export default function Dashboard() {
    const [courses, setCourses] = useState<CourseCardProps[]>([]);

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
    
    return (
        <>
            
            {courses.map((course) => {
                    return (
                        <CardImage
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        instructor={course.instructor}
                        createdAt={course.createdAt}
                        >
                        </CardImage>

                    )
                })}
        </>
    )
}