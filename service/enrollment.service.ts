import { BadRequestError } from "@/errors/badrequest";
import { NotFoundError } from "@/errors/notfound";
import { CourseRepository } from "@/repository/course.repository";
import { TokenPayload } from "@/types";
import { EnrollmentRepository } from "@/repository/enrollment.repository"
import { EnrollRequestDTO } from "@/types";
import { ForbiddenError } from "@/errors/forbidden";
import { ConflictError } from "@/errors/conflict";

export class EnrollmentService{
    private courseRepository = new CourseRepository();
    private enrollmentRepository = new EnrollmentRepository();

    async enroll(data: EnrollRequestDTO, user: TokenPayload){
        if(!data.courseId) {
            throw new BadRequestError("Id do curso não informado");
        };

        const courseId = data.courseId;

        const existingCourse = await this.courseRepository.findById(courseId);
        if(!existingCourse) {
            throw new NotFoundError("Curso não existe");
        }

        if(existingCourse.status !== "PUBLISHED") {
            throw new ForbiddenError("Você não pode se matricular neste curso");
        }

        const courseAlreadyEnrolled = await this.enrollmentRepository.findEnrollment(courseId, user.sub);

        if(courseAlreadyEnrolled) {
            throw new ConflictError("Curso já marticulado!")
        }

        const enrollment = await this.enrollmentRepository.create({courseId: courseId, userId: user.sub});

        return enrollment;
    }
    
    async findEnrolledCoursesByUserId(user: TokenPayload) {
        return await this.enrollmentRepository.findAllEnrolments(user.sub);
    }
}