import { prisma } from "@/lib/prisma";
import { AdminUserRequestDTO, UserRequestDTO } from "@/types";
import { Role } from "../app/generated/prisma/client";


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

    async adminCreate(data: AdminUserRequestDTO) {
        return prisma.user.create({
            data
        })
    }

    async update(
        id: string,
        data: UserRequestDTO
    ) {
        return prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                password: data.password
            }
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id }
        });
    }

}