import { ForbiddenError } from "@/errors/forbidden";
import { TokenPayload } from "@/types";

export function requireRole(
    user: TokenPayload,
    roles: string[]){
     if(!roles.includes(user.role)) {
        throw new ForbiddenError(
            "Você não possui permissão para esta ação"
        )
     }
}