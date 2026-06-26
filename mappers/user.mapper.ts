import type { User } from "@prisma/client";
import { UserResponseDTO } from "@/types";

export class UserMapper{

    static toResponse(user: User): UserResponseDTO {
        return {
            id: user.id,
            name: user.name,
        }
}}