import { CourseService } from "@/service/course.service";


const courseService: CourseService = new CourseService();

export async function POST(request: Request){
    const body = await request.json();

    const createdCourse = await courseService.createCourse(body);

    return Response.json(createdCourse);
}

export async function GET() {
    const courses = await courseService.getAllCourses();

    return Response.json(courses);
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const id = body.id;
    const updatedCourse = await courseService.updateCourse(id, body);

    return Response.json(updatedCourse);
}

export async function DELETE(request: Request){
    const body = await request.json();
    const id = body.id;
    const deletedCourse = await courseService.deleteCourse(id);

    return Response.json(deletedCourse);
}