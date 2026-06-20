import { ModuleService } from "@/service/module.service";
import { getAuthenticatedUser } from "@/lib/auth";

const moduleService: ModuleService = new ModuleService();
export async function POST(request: Request){
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }

    const body = await request.json();

    const moduleRequest = await moduleService.createModule(body);

    return Response.json(moduleRequest);

}

export async function GET(request: Request){
    const user = await getAuthenticatedUser(request);

    if(user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
        return Response.json(
            { message: "Forbidden" },
            { status: 403 }
        )
    }

    const modules = await moduleService.getAllModules();

    return Response.json(modules);
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

    const deletedModule = await moduleService.deleteModule(id);

    return Response.json(deletedModule);
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
    const updatedModule = await moduleService.updateModule(body);

    return Response.json(updatedModule);
}