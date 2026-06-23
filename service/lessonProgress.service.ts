import { TokenPayload } from "@/types";
import { LessonService } from "./lesson.service";
import { CourseService } from "./course.service";
import { NotFoundError } from "@/errors/notfound";
import { ModuleService } from "./module.service";
import { CourseRepository } from "@/repository/course.repository";
import { EnrollmentService } from "./enrollment.service";
import { LessonProgressRepository } from "@/repository/lessonProgress.repository";


export class LessonProgressService {
    private courseRepository = new CourseRepository();

    private lessonService = new LessonService();
    private courseService = new CourseService();
    private moduleService = new ModuleService();
    private enrollmentService = new EnrollmentService();
    private lessonProgressRepository = new LessonProgressRepository();

    constructor () {}

    async completeLessonProgress(lessonId: string, user: TokenPayload){
        const lesson = await this.lessonService.getLessonById(lessonId, user);
        if(!lesson) {
            throw new NotFoundError("Aula não encontrada")
        }
        const existingModule = await this.moduleService.findModuleById(lesson.moduleId);
        const course = await this.courseService.findCourseById(existingModule.courseId, user);
        if(!course) {
            throw new NotFoundError("Curso não existente")
        }

        const existingEnrollment = await this.enrollmentService.verifyEnrollment(course.id, user.sub);

        const existingLessonProgress = await this.lessonProgressRepository.findByLessonAndEnrollmentId(lesson.id, existingEnrollment.id);

        if(existingLessonProgress) {
            return existingLessonProgress;
        }
        const createProgress = await this.lessonProgressRepository.create(existingEnrollment.id, lesson.id);

        const completeLessons = await this.lessonProgressRepository.findAllCompleteLessonsByEnrollmentId(existingEnrollment.id);
        
        const courseAndLessons = await this.courseRepository.findCourseWithAllLessons(course.id);
        if(!courseAndLessons){
            throw new NotFoundError("Erro ao encontrar aulas")
        }

        const totalLessons = courseAndLessons.modules.reduce((acc, module) => acc + module.lessons.length, 0);
        const progress = (completeLessons / totalLessons) * 100;

        await this.enrollmentService.setProgress(progress, existingEnrollment.id);

        return createProgress;
    }
}