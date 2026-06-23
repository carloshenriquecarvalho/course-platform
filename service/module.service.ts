import { NotFoundError } from "@/errors/notfound";
import { requireRole } from "@/lib/authorization";
import { ModuleRepository } from "@/repository/module.repository";
import { ModuleRequestDTO, ModuleUpdateRequestDTO, TokenPayload } from "@/types";

export class ModuleService {
    private moduleRepository = new ModuleRepository();
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