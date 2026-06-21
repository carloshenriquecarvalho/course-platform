import { ModuleService } from "@/service/module.service";
import { getAuthenticatedUser } from "@/lib/auth";

const moduleService: ModuleService = new ModuleService();
export async function POST(request: Request){
    const user = await getAuthenticatedUser(request);

    const body = await request.json();

    const moduleRequest = await moduleService.createModule(body, user);

    return Response.json(moduleRequest);

}

export async function GET(request: Request){
    const user = await getAuthenticatedUser(request);

    const modules = await moduleService.getAllModules(user);

    return Response.json(modules);
}

export async function DELETE(request: Request){
    const user = await getAuthenticatedUser(request);

    const body = await request.json();
    const moduleId = body.id;

    const deletedModule = await moduleService.deleteModule(moduleId, user);

    return Response.json(deletedModule);
}

export async function PATCH(request: Request){
    const user = await getAuthenticatedUser(request);

    const body = await request.json();
    const updatedModule = await moduleService.updateModule(body, user);

    return Response.json(updatedModule);
}