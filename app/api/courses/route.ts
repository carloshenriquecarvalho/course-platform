import { CourseService } from "@/service/course.service";
import { getAuthenticatedUser } from "@/lib/auth"
import { apiHandler } from "@/lib/api-handler";
import { validate } from "@/lib/data-handler";
import { createCourseSchema } from "@/schemas/course.schema";
import { updateCourseSchema } from "@/schemas/course.schema";

const courseService: CourseService = new CourseService();

export async function POST(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
    
        const body = await request.json();

        const validatedData = validate(createCourseSchema, body);
    
        const createdCourse = await courseService.createCourse(validatedData, user);
    
        return Response.json(createdCourse);
    });
}

export async function GET(request: Request) {
    return apiHandler(async () => {
        await getAuthenticatedUser(request);
    
        const courses = await courseService.findAllCourses();
    
        return Response.json(courses);
    });
}

export async function PATCH(request: Request) {
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
    
        const body = await request.json();
        const validatedData = validate(updateCourseSchema, body);

        const id = body.id;
        const updatedCourse = await courseService.updateCourse(id, validatedData, user);

    
        return Response.json(updatedCourse);
    });
}

export async function DELETE(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
    
        const body = await request.json();

        const deletedCourse = await courseService.deleteCourse(body.id, user);
    
        return Response.json(deletedCourse);
    });
}