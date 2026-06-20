import { LessonService } from "@/service/lesson.service";
import { validate } from "@/lib/data-handler"
import { getAuthenticatedUser } from "@/lib/auth";
import { createLessonSchema } from "@/schemas/lesson.schema";


const lessonService = new LessonService();
export async function GET(request: Request){

    await getAuthenticatedUser(request);
    const lessons = await lessonService.getAllLessons();

    return Response.json(lessons);
}

export async function POST(request: Request) {
    const user = await getAuthenticatedUser(request);

    const body = await request.json();
    const validatedData = validate(createLessonSchema, body);
    const lesson = await lessonService.createLesson(validatedData, user);

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

    const validatedData = validate(createLessonSchema, body);
    

    const id = body.id;
    const lesson = await lessonService.updateLesson(id, validatedData, user);

    return Response.json(lesson);
}