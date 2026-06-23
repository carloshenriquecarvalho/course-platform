import { prisma } from "@/lib/prisma"
import { EnrollRequestDTO } from "@/types"
import { CourseUpdateRequestDTO } from "@/types";

export class EnrollmentRepository{
    constructor(){}

    async create(data: EnrollRequestDTO) {
        return await prisma.enrollment.create({
            data
        });
    }

    async findEnrollment(courseId: string, userId: string) {
        return prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    courseId: courseId, userId: userId}
                }
        })
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

    async findAllEnrolments(data: string){
        return prisma.course.findMany({
            where: {
                enrollments: {
                    some: {
                        userId: data
                    }
                }
            },
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }

    async updateProgess(progress: number, id: string){
        return prisma.enrollment.update({
            where: {id},
            data: {
                progress: progress
            } 
        })
    }
}