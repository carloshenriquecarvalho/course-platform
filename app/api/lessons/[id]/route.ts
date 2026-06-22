import { apiHandler } from "@/lib/api-handler";
import { getAuthenticatedUser } from "@/lib/auth";
import { LessonService } from "@/service/lesson.service"

const lessonService = new LessonService();
export async function GET(request: Request, { params }: { params: Promise<{ id: string }>}){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
        const { id } = await params;

        const lesson = await lessonService.getLessonById(id, user);

        return Response.json(user);
    });
}