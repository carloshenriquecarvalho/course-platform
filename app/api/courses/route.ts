import { CourseService } from "@/service/course.service";
import { getAuthenticatedUser } from "@/lib/auth"

const courseService: CourseService = new CourseService();

export async function POST(request: Request){
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }

    const body = await request.json();

    const createdCourse = await courseService.createCourse(body, user.sub);

    return Response.json(createdCourse);
}

export async function GET(request: Request) {
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }

    const courses = await courseService.getAllCourses();

    return Response.json(courses);
}

export async function PATCH(request: Request) {
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }

    const body = await request.json();
    const id = body.id;
    const updatedCourse = await courseService.updateCourse(id, body);

    return Response.json(updatedCourse);
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
    const id = body.id;
    const deletedCourse = await courseService.deleteCourse(id);

    return Response.json(deletedCourse);
}