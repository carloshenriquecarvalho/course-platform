import { prisma } from "@/lib/prisma";
import { ModuleRequestDTO, ModuleUpdateRequestDTO } from "@/types";

export class ModuleRepository {
    async create(data: ModuleRequestDTO){
        return await prisma.module.create({data});
    }

    async getAll(){
        return await prisma.module.findMany();
    }

    async delete(id: string){
        return await prisma.module.delete({
            where: {id}
        })
    }

    async update(id: string, data: ModuleUpdateRequestDTO) {
        return await prisma.module.update({
            where: {id},
            data
        });
    }

    async findById(id: string) {
        return await prisma.module.findUnique({
            where: {id}
        })
    }
}