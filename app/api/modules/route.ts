import { ModuleService } from "@/service/module.service";

const moduleService: ModuleService = new ModuleService();
export async function POST(request: Request){
    const body = await request.json();

    const moduleRequest = await moduleService.createModule(body);

    return Response.json(moduleRequest);

}

export async function GET(){
    const modules = await moduleService.getAllModules();

    return Response.json(modules);
}

export async function DELETE(request: Request){
    const body = await request.json();
    const id = body.id;

    const deletedModule = await moduleService.deleteModule(id);

    return Response.json(deletedModule);
}

export async function PATCH(request: Request){
    const body = await request.json();
    const updatedModule = moduleService.updateModule(body);

    return Response.json(updatedModule);
}