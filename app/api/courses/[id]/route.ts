import { getAuthenticatedUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { CourseService } from "@/service/course.service";


const courseService = new CourseService();
export async function GET(request: Request, { params }: { params: Promise<{ id: string }>}) {
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
        const { id } = await params;

        const course = await courseService.findCourseById(id, user);

        return Response.json(course);
    });
}