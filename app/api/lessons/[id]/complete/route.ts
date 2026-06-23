import { apiHandler } from "@/lib/api-handler";
import { getAuthenticatedUser } from "@/lib/auth";
import { LessonProgressService } from "@/service/lessonProgress.service";


const lessonProgressService = new LessonProgressService();
export async function POST(request: Request, { params }: { params: Promise<{ id: string }>}) {
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
        const { id } = await params;
        const lessonMarkedAsComplete = await lessonProgressService.completeLessonProgress(id, user);
        
        return Response.json(lessonMarkedAsComplete);
    })
}