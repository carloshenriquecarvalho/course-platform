import { LessonService } from "@/service/lesson.service";
import { getAuthenticatedUser } from "@/lib/auth";


const lessonService = new LessonService();
export async function GET(request: Request){
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }
    const lessons = await lessonService.getAllLessons();

    return Response.json(lessons);
}

export async function POST(request: Request) {
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }

    const body = await request.json()
    const lesson = await lessonService.createLesson(body);

    return Response.json(lesson);
}

export async function DELETE(request: Request){
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }
    
    const body = await request.json();

    const lesson = await lessonService.deleteLesson(body.id);

    return Response.json(lesson);
}


export async function PATCH(request: Request){
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }
    
    const body = await request.json();
    const id = body.id;
    const lesson = await lessonService.updateLesson(id, body);

    return Response.json(lesson);
}