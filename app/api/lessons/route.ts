import { LessonService } from "@/service/lesson.service";
import { getAuthenticatedUser } from "@/lib/auth";


const lessonService = new LessonService();
export async function GET(request: Request){

    const user = await getAuthenticatedUser(request);
    const lessons = await lessonService.getAllLessons();

    return Response.json(lessons);
}

export async function POST(request: Request) {
    const user = await getAuthenticatedUser(request);

    const body = await request.json()
    const lesson = await lessonService.createLesson(body, user);

    return Response.json(lesson);
}

export async function DELETE(request: Request){
    const user = await getAuthenticatedUser(request);
    
    const body = await request.json();

    const lesson = await lessonService.deleteLesson(body.id, user);

    return Response.json(lesson);
}


export async function PATCH(request: Request){
    const user = await getAuthenticatedUser(request);
    
    const body = await request.json();
    const id = body.id;
    const lesson = await lessonService.updateLesson(id, body, user);

    return Response.json(lesson);
}