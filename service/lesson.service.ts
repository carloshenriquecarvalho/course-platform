import { NotFoundError } from "@/errors/notfound";
import { requireRole } from "@/lib/authorization";
import { LessonRepository } from "@/repository/lesson.repository";
import { LessonRequestDTO, TokenPayload } from "@/types";
import { LessonUpdateRequestDTO } from "@/types";

export class LessonService{
    private lessonRepository = new LessonRepository();
    
    constructor(){}

    async createLesson(data: LessonRequestDTO, user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ])

        if(!data.title || !data.order){
            throw new Error("Dados obrigatórios não informados")
        }

        const lesson = await this.lessonRepository.create(data);

        return lesson;
    }

    async getAllLessons(){
        const lessons = await this.lessonRepository.findAll();

        return lessons;
    }

    async deleteLesson(id: string, user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        const existingLesson = await this.lessonRepository.finById(id);

        if(!existingLesson) {
            throw new NotFoundError("Aula não encontrada")
        }

        const lesson = await this.lessonRepository.delete(id);

        return lesson;
    }

    async updateLesson(id: string, lesson: LessonUpdateRequestDTO, user: TokenPayload) {
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);
        
        const existingLesson = await this.lessonRepository.finById(id);

        if(!existingLesson) {
            throw new NotFoundError("Lição não encontrada");
        }

        const updatedLesson = await this.lessonRepository.update(id, lesson);

        return updatedLesson;
    }

}