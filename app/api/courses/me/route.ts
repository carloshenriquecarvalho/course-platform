import { apiHandler } from "@/lib/api-handler";
import { getAuthenticatedUser } from "@/lib/auth";
import { EnrollmentService } from "@/service/enrollment.service";

const enrollmentService = new EnrollmentService();
export async function GET(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);

        const enrolledCourses = await enrollmentService.findEnrolledCoursesByUserId(user);

        return Response.json(enrolledCourses);
    })
}