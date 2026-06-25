import { prisma } from "@/lib/prisma"
import { LessonRequestDTO } from "@/types";
import { LessonUpdateRequestDTO } from "@/types";

export class LessonRepository {
    constructor() {

    }

    async create(lesson: LessonRequestDTO){
        return await prisma.lesson.create({
            data: {
                title: lesson.title,
                order: lesson.order,
                moduleId: lesson.moduleId,
                duration: lesson.duration,
                description: lesson.description,
                videoPath: lesson.videoPath
            }
        })
    }

    async findAll(){
        return await prisma.lesson.findMany();
    }

    async delete(id: string){
        return await prisma.lesson.delete({
            where: {
                id: id
            }
        });
    }

    async update(id: string, data: LessonUpdateRequestDTO) {
        return await prisma.lesson.update({
            where: {id},
            data
        });
    }

    async finById(id: string) {
        return await prisma.lesson.findUnique({
            where: {id}
        })
    }

    async verifyIfSameOrderExists(order: number, moduleId: string) {
        return prisma.lesson.findFirst({
            where: {
                order: order,
                moduleId: moduleId
            }
        })
    }

    async findLessonAndCourseAndModuleById(lessonId: string){
        return await prisma.lesson.findUnique({
            where: {id: lessonId},
            include: {
                attachments: true,
                module: {
                    include: {
                        course: {
                            include: {
                                instructor: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                                modules: {
                                    orderBy: {
                                        order: "asc"
                                },
                                
                                include: {
                                    lessons: {
                                        orderBy: {
                                            order: "asc"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    
    });
    
}}