import { apiHandler } from "@/lib/api-handler";
import { getAuthenticatedUser } from "@/lib/auth";
import { CourseService } from "@/service/course.service";

const courseService = new CourseService();

export async function GET(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);

        const dashboardCourses = await courseService.getDashboardCourses(user);

        return Response.json(dashboardCourses);
    });
}