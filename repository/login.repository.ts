import { prisma } from "@/lib/prisma";

export class LoginRepository {
    async findUser(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    }
}