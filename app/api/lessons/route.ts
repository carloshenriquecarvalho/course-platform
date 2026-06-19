import { LessonService } from "@/service/lesson.service";

const lessonService = new LessonService();
export async function GET(){
    const lessons = await lessonService.getAllLessons();

    return Response.json(lessons);
}

export async function POST(request: Request) {
    const body = await request.json()
    const lesson = await lessonService.createLesson(body);

    return Response.json(lesson);
}

export async function DELETE(request: Request){
    const body = await request.json();

    const lesson = await lessonService.deleteLesson(body.id);

    return Response.json(lesson);
}


export async function PATCH(request: Request){
    const body = await request.json();
    const id = body.id;
    const lesson = await lessonService.updateLesson(id, body);

    return Response.json(lesson);
}