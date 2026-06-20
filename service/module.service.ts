import { ModuleRepository } from "@/repository/module.repository";
import { ModuleRequestDTO, ModuleUpdateRequestDTO } from "@/types";

export class ModuleService {
    private moduleRepository = new ModuleRepository();
    constructor(){}

    async createModule(data: ModuleRequestDTO,){
        const moduleRequest = await this.moduleRepository.create(data);

        return moduleRequest;
    }

    async getAllModules(){
        const modules = await this.moduleRepository.getAll();
        return modules;
    }

    async deleteModule(id: string){
        const deletedModule = await this.moduleRepository.delete(id);
        return deletedModule;
    }

    async updateModule(moduleUpdate: ModuleUpdateRequestDTO){
        const id = moduleUpdate.id;
        const updatedModule = await this.moduleRepository.update(id, moduleUpdate);

        return updatedModule;
    }

}