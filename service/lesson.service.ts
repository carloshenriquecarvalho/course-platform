import { BadRequestError } from "@/errors/badrequest";
import { ConflictError } from "@/errors/conflict";
import { ForbiddenError } from "@/errors/forbidden";
import { NotFoundError } from "@/errors/notfound";
import { requireRole } from "@/lib/authorization";
import { CourseRepository } from "@/repository/course.repository";
import { EnrollmentRepository } from "@/repository/enrollment.repository";
import { LessonRepository } from "@/repository/lesson.repository";
import { ModuleRepository } from "@/repository/module.repository";
import { LessonRequestDTO, TokenPayload } from "@/types";
import { LessonUpdateRequestDTO } from "@/types";

export class LessonService{
    private lessonRepository = new LessonRepository();
    private moduleRepository = new ModuleRepository();
    private enrollmentRepository = new EnrollmentRepository();
    private courseRepository = new CourseRepository();
    
    constructor(){}

    async createLesson(data: LessonRequestDTO, user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        if(!data.title && !data.order){
            throw new BadRequestError("Dados obrigatórios não informados");
        }

        const existingLesson = await this.lessonRepository.verifyIfSameOrderExists(data.order);
        if(existingLesson) {
            throw new ConflictError("A aula não pode ter mesma posição que outra aula")
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

    async getLessonById(id: string, user: TokenPayload) {
        if(!id) {
            throw new BadRequestError("ID da aula inválido");
        }

        const existingLesson = await this.lessonRepository.finById(id);
        if(!existingLesson) {
            throw new NotFoundError("Aula não encontrada");
        }

        const lessonModule = await this.moduleRepository.findById(existingLesson.moduleId);
        if(!lessonModule) {
            throw new NotFoundError("Módulo não encontrado");
        }

        const lessonCourse = await this.courseRepository.findById(lessonModule.courseId);
        if(!lessonCourse) {
            throw new NotFoundError("Curso não encontrado");
        }

        const isUserAlreadyEnrolled = await this.enrollmentRepository.findEnrollment(lessonCourse.id, user.sub);
        if(!isUserAlreadyEnrolled) {
            throw new ForbiddenError("Você não está matriculado neste curso");
        }

        const lesson = await this.lessonRepository.findLessonAndCourseAndModuleById(id);

        return lesson;
    }

}