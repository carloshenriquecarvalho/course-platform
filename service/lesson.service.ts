import { LessonRepository } from "@/repository/lesson.repository";
import { LessonRequestDTO } from "@/types";
import { LessonUpdateRequestDTO } from "@/types";

export class LessonService{
    private lessonRepository = new LessonRepository();
    
    constructor(){}

    async createLesson(data: LessonRequestDTO){
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

    async deleteLesson(id: string){
        const lesson = await this.lessonRepository.delete(id);

        return lesson;
    }

    async updateLesson(id: string, lesson: LessonUpdateRequestDTO) {
        const updatedLesson = await this.lessonRepository.update(id, lesson);

        return updatedLesson;
    }

}