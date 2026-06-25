'use client'
import Image from "next/image";
import useFetchData from "@/app/hooks/useFetchData";
import { Course } from "@/app/types";
import { SquarePlay } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Props {
    id: string;
}

export default function CourseDetails({ id }: Props) {
    const router = useRouter();
    const {
        data: course,
        loading,
        error,
    } = useFetchData<Course>({
        url: `/api/courses/${id}`,
    });

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }

    if (!course) {
        return <p>Curso não encontrado.</p>;
    }
    

    return (
        <>  
            <div>
                
            </div>
            <main className="w-full h-screen bg-red-200 px-75">
                <div>
                    <Image
                    src={"/mock-course-page.png"}
                    width={500}
                    height={300}
                    sizes="100vw"
                    alt="background"
                    style={{
                        width: '100%',
                        height: 'auto'
                    }}
                    ></Image>
                </div>
                <div>
                    <div className="flex flex-col h-70 justify-center">
                        <h1 className="text-6xl">{course.title}</h1>
                        <p className="text-2xl">{course.description}</p>
                    </div>
                    <div className="w-full bg-white flex justify-end">
                        <button className="p-2 bg-amber-500 cursor-pointer hover:opacity-80 duration-400">Assitir Curso</button>
                    </div>
                </div>
                <div className="bg-amber-300 mt-20">
                    <Accordion
                        type="multiple"
                        className="w-full p-3"
                        >
                        {course.modules.map((module) => (
                            <AccordionItem 
                            key={module.id}
                            value={module.id}
                            >
                            <AccordionTrigger className="text-2xl cursor-pointer">
                                {module.title}
                            </AccordionTrigger>


                            <AccordionContent>
                                <ul className="space-y-2 cursor-pointer">
                                    {module.lessons.map((lesson) => (
                                    <li
                                        key={lesson.id}
                                        className="p-2 rounded hover:bg-gray-100"
                                    >
                                        <button 
                                        onClick={() =>
                                        router.push(
                                        `/course/${course.id}/lesson/${lesson.id}`)
                                        }
                                        className="flex gap-1 items-center">
                                            <SquarePlay width={15} strokeWidth='2'/> {lesson.title}
                                        </button>
                                    </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </main>
        </>
    );
}