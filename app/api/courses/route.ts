import { CourseService } from "@/service/course.service";
import { getAuthenticatedUser } from "@/lib/auth"
import { apiHandler } from "@/lib/api-handler";

const courseService: CourseService = new CourseService();

export async function POST(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
    
        const body = await request.json();
    
        const createdCourse = await courseService.createCourse(body, user);
    
        return Response.json(createdCourse);
    });
}

export async function GET(request: Request) {
    return apiHandler(async () => {
        await getAuthenticatedUser(request);
    
        const courses = await courseService.getAllCourses();
    
        return Response.json(courses);
    });
}

export async function PATCH(request: Request) {
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
    
        const body = await request.json();
        const id = body.id;
        const updatedCourse = await courseService.updateCourse(id, body, user);
    
        return Response.json(updatedCourse);
    });
}

export async function DELETE(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
    
        const body = await request.json();
        const id = body.id;
        const deletedCourse = await courseService.deleteCourse(id, user);
    
        return Response.json(deletedCourse);
    });
}