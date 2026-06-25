import { NotFoundError } from "@/errors/notfound";
import { ForbiddenError } from "@/errors/forbidden";
import { requireRole } from "@/lib/authorization";
import { ModuleRepository } from "@/repository/module.repository";
import { CourseRepository } from "@/repository/course.repository";
import { ModuleRequestDTO, ModuleUpdateRequestDTO, TokenPayload } from "@/types";

export class ModuleService {
    private moduleRepository = new ModuleRepository();
    private courseRepository = new CourseRepository();
    constructor(){}

    async createModule(data: ModuleRequestDTO, user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        const moduleRequest = await this.moduleRepository.create(data);

        return moduleRequest;
    }

    async getAllModules(user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ])
        const modules = await this.moduleRepository.getAll();
        return modules;
    }

    async deleteModule(id: string, user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        const existingModule = await this.moduleRepository.findById(id);

        if(!existingModule) {
            throw new NotFoundError("Módulo não existe")
        }

        if (user.role === "INSTRUCTOR") {
            const course = await this.courseRepository.findById(existingModule.courseId);
            if (!course || course.instructorId !== user.sub) {
                throw new ForbiddenError("Você não tem permissão para deletar este módulo");
            }
        }

        const deletedModule = await this.moduleRepository.delete(id);
        return deletedModule;
    }

    async updateModule(moduleUpdate: ModuleUpdateRequestDTO, user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        const existingModule = await this.moduleRepository.findById(moduleUpdate.id);
        if(!existingModule) {
            throw new NotFoundError("Módulo não existe")
        }

        if (user.role === "INSTRUCTOR") {
            const course = await this.courseRepository.findById(existingModule.courseId);
            if (!course || course.instructorId !== user.sub) {
                throw new ForbiddenError("Você não tem permissão para editar este módulo");
            }
        }

        const id = moduleUpdate.id;
        const updatedModule = await this.moduleRepository.update(id, moduleUpdate);

        return updatedModule;
    }

    async findModuleById(id: string){
            const existingModule = await this.moduleRepository.findById(id);
            if(!existingModule) {
                throw new NotFoundError("Curso não existe")
            }

            return existingModule;
        }

}