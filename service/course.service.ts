import { ForbiddenError } from "@/errors/forbidden";
import { NotFoundError } from "@/errors/notfound";
import { requireRole } from "@/lib/authorization";
import { CourseRepository } from "@/repository/course.repository"
import { EnrollmentRepository } from "@/repository/enrollment.repository";
import { CourseRequestDTO, TokenPayload } from "@/types";
import { CourseUpdateRequestDTO } from "@/types"

export class CourseService{
    private courseRepository = new CourseRepository();
    private enrollmentRepository = new EnrollmentRepository();
    constructor(){}


    async createCourse(createCourse: CourseRequestDTO, user: TokenPayload){
        requireRole(user, ["ADMIN", "INSTRUCTOR"]);

        let instructorId = user.sub;
        if (user.role === "ADMIN" && createCourse.instructorId) {
            instructorId = createCourse.instructorId;
        }

        const createdCourse = await this.courseRepository.create(createCourse, instructorId);

        return createdCourse;
    }

    async findAllCourses(){
        const courses = await this.courseRepository.getAll();

        return courses;
    }

    async getDashboardCourses(user: TokenPayload) {
        return this.courseRepository.findDashboardCourses(user.role, user.sub);
    }

    async updateCourse(courseId: string, course: CourseUpdateRequestDTO, user: TokenPayload){
        requireRole(user, ["ADMIN", "INSTRUCTOR"]);

        const existingCourse = await this.courseRepository.findById(courseId);

        if(!existingCourse) {
            throw new NotFoundError("Curso não encontrado");
        }

        if(user.role === "INSTRUCTOR" && existingCourse.instructorId !== user.sub) {
            throw new ForbiddenError("Você não pode editar este curso")
        }

        const updatedCourse = await this.courseRepository.update(courseId, course);
        return updatedCourse;
    }

    async deleteCourse(courseId: string, user: TokenPayload) {
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ])

        const existingCourse = await this.courseRepository.findById(courseId);

        if(!existingCourse) {
            throw new NotFoundError("Curso não encontrado");
        }

        if(user.role === "INSTRUCTOR" && existingCourse.instructorId !== user.sub) {
            throw new ForbiddenError("Você não pode deletar este curso");
        }

        const deletedCourse = await this.courseRepository.delete(courseId);

        return deletedCourse;
    }

    async findCourseById(id: string, user: TokenPayload){
        const existingCourse = await this.courseRepository.findById(id);
        if(!existingCourse) {
            throw new NotFoundError("Curso não existe")
        }

        const isAdmin = user.role === "ADMIN";
        const isInstructor = user.role === "INSTRUCTOR" && existingCourse.instructorId === user.sub;

        if (!isAdmin && !isInstructor) {
            const userIsEnrolled = await this.enrollmentRepository.findEnrollment(id, user.sub);
            if(!userIsEnrolled) {
                throw new ForbiddenError("Você precisa estar matriculado neste curso para acessá-lo");
            }
        }

        const course = await this.courseRepository.findCourseAndModulesById(id);

        return course;
    }
}