import { prisma } from "@/lib/prisma"
import { CourseRequestDTO } from "@/types"
import { CourseStatus } from "@/app/generated/prisma"
import { CourseUpdateRequestDTO } from "@/types"

export class CourseRepository{
    constructor(){}

    async create(data: CourseRequestDTO){
        return prisma.course.create({
            data:{ 
                title: data.title,
                status: CourseStatus.DRAFT,
                description: data.description,
                instructorId: data.instructorId
            }});

    }

    async getAll() {
        return prisma.course.findMany();
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
}