import { UserResponseDTO } from "@/types";
import { User } from "@prisma/client";

export class UserMapper{

    static toResponse(user: User): UserResponseDTO {
        return {
            id: user.id,
            name: user.name,
        }
}}