'use client'

import {SquarePlay} from "lucide-react"
import useFetchData from "@/app/hooks/useFetchData";
import { Lesson } from "@/app/types";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
interface Props {
    lessonId: string;
}

export function LessonDetails({ lessonId }: Props) {
    const router = useRouter();
    const { data: lesson, loading, error} = useFetchData<Lesson>({
        url: `/api/lessons/${lessonId}`
    });

    if(loading) {
        return <p>Carregando...</p>
    }

    if(error) {
        return <p>Erro: {error}</p>
    }

    if(!lesson) {
        return <p>Não há lição a ser carregada</p>
    }
    return (
        <>
        <div className="flex h-screen w-full overflow-hidden justify-between">
            <main>
                <iframe width="560" height="315" src={lesson.videoPath} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <h1>{lesson.title}</h1>
                <p>{lesson.description}</p>
            </main>
            <aside className="w-64 h-full shrink-0 border-l hidden lg:block md:block">
        
            <Accordion
                        type="multiple"
                        className="w-full p-3"
                        >
                        {lesson.module.course.modules.map((module) => (
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
                                        `/course/${module.courseId}/lesson/${lesson.id}`)
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
            </aside>
        </div>
        </>
    )
}