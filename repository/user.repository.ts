import { prisma } from "@/lib/prisma";
import { UserRequestDTO } from "@/types";
import { Role } from "@/app/generated/prisma";


export class UserRepository {

    constructor() {

    }

    async findAll() {
        console.log(process.env.SUPABASE_URL);
        console.log(process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));
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