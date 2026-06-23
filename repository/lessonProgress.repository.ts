import { prisma  }from "@/lib/prisma"

export class LessonProgressRepository {

    async create(enrollmentId: string, lessonId: string){
        return prisma.lessonProgress.create({
            data: {
                enrollmentId: enrollmentId,
                lessonId: lessonId
            }
        })
    }

    async findByLessonAndEnrollmentId(lessonId: string, enrollmentId: string) {
        return prisma.lessonProgress.findUnique({
            where: {enrollmentId_lessonId: {
                enrollmentId: enrollmentId,
                lessonId: lessonId
            }}
        })
    }

    async findAllCompleteLessonsByEnrollmentId(id: string){
        return prisma.lessonProgress.count({
            where: { enrollmentId: id}
        });
    }
}