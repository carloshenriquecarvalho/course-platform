import type { User } from "@/app/generated/prisma";
import { UserResponseDTO } from "@/types";

export class UserMapper{

    static toResponse(user: User): UserResponseDTO {
        return {
            id: user.id,
            name: user.name,
        }
}}