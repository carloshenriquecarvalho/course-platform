import { prisma } from "@/lib/prisma";
import { ModuleRequestDTO, ModuleUpdateRequestDTO } from "@/types";

export class ModuleRepository {
    async create(data: ModuleRequestDTO){
        return prisma.module.create({data});
    }

    async getAll(){
        return prisma.module.findMany();
    }

    async delete(id: string){
        return prisma.module.delete({
            where: {id}
        })
    }

    async update(id: string, data: ModuleUpdateRequestDTO) {
        return prisma.module.update({
            where: {id},
            data
        });
    }

    async findById(id: string) {
        return prisma.module.findUnique({
            where: {id}
        })
    }
}