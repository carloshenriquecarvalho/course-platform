import { apiHandler } from "@/lib/api-handler";
import { getAuthenticatedUser } from "@/lib/auth";
import { EnrollmentService } from "@/service/enrollment.service";


const enrollmentService = new EnrollmentService();
export async function POST(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
        const body = await request.json();

        const enrollment = await enrollmentService.enroll(body, user);

        return Response.json(enrollment);
    });
}