import { CourseService } from "@/service/course.service";


const courseService = new CourseService();
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const body = await request.json();

    return courseService.updateCourse(
        params.id,
        body
    );
}