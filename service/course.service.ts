import { CourseRepository } from "@/repository/course.repository"
import { CourseRequestDTO } from "@/types";
import { CourseUpdateRequestDTO } from "@/types"

export class CourseService{
    private courseRepository = new CourseRepository();
    constructor(){}


    async createCourse(createCourse: CourseRequestDTO){
        const createdCourse = await this.courseRepository.create(createCourse);

        return createdCourse;
    }

    async getAllCourses(){
        const courses = await this.courseRepository.getAll();

        return courses;
    }

    async updateCourse(id: string, course: CourseUpdateRequestDTO){
        const updatedCourse = await this.courseRepository.update(id, course);
        return updatedCourse;
    }

    async deleteCourse(id: string) {
        const deletedCourse = await this.courseRepository.delete(id);

        return deletedCourse;
    }
}