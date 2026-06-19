import { prisma } from "@/lib/prisma";
import { UserRequestDTO } from "@/types";
import { Role } from "@/app/generated/prisma";


export class UserRepository {

    constructor() {

    }

    async findAll() {
        return prisma.user.findMany();
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id }
        });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    async create(data: UserRequestDTO) {
        return prisma.user.create({
            data: {
                ...data,
                role: Role.USER
            }
        });
    }

    async update(
        id: string,
        data: Partial<UserRequestDTO>
    ) {
        return prisma.user.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id }
        });
    }
}