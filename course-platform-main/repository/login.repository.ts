import { prisma } from "@/lib/prisma";

export class LoginRepository {
    async findUser(email: string) {
        return prisma.user.findUnique({
            where: {
                email
            }
        });
    }
}