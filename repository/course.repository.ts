import { prisma } from "@/lib/prisma"
import { CourseRequestDTO } from "@/types"
import { CourseStatus } from "@/app/generated/prisma"
import { CourseUpdateRequestDTO } from "@/types"

export class CourseRepository{
    constructor(){}

    async create(data: CourseRequestDTO, userId: string){
        return prisma.course.create({
            data:{ 
                title: data.title,
                status: CourseStatus.DRAFT,
                description: data.description, 
                instructorId: userId
            }});

    }

    async getAll() {
        return prisma.course.findMany();
    }

    async findDashboardCourses(role: string, userId: string) {
        if (role === "ADMIN") {
            return prisma.course.findMany({
                include: { instructor: { select: { id: true, name: true } } }
            });
        }
        if (role === "INSTRUCTOR") {
            return prisma.course.findMany({
                where: {
                    OR: [
                        { instructorId: userId },
                        { enrollments: { some: { userId: userId } } }
                    ]
                },
                include: { instructor: { select: { id: true, name: true } } }
            });
        }
        // Default (USER)
        return prisma.course.findMany({
            where: {
                enrollments: { some: { userId: userId } }
            },
            include: { instructor: { select: { id: true, name: true } } }
        });
    }

    async update(id: string, data: CourseUpdateRequestDTO){
        return prisma.course.update({
            where: {id},
            data: {
                title: data.title,
                description: data.description,
                status: data.status
            }
        });
    }

    async delete(id: string){
        return prisma.course.delete({where: {id}})
    }

    async findById(courseId: string){
        return prisma.course.findUnique({
            where: {id: courseId}
        })
    }

    async findCourseAndModulesById(courseId: string) {
        return prisma.course.findUnique({
            where: {id: courseId},
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
                    select: {
                        id: true,
                        title: true,
                        order: true,
                        lessons: {
                            orderBy :{
                                order: "asc"
                            },
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                duration: true,
                                videoPath: true,
                                order: true
                            }
                        }
                        
                    },
                },
            }
        });
    }

    async findCourseWithAllLessons(id: string){
        return prisma.course.findUnique({
            where: {id},
            include: {
                modules: {
                    include: {
                        lessons: true
                    }
                }
            }
        })
    }
}

