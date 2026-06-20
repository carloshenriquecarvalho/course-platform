import { UnauthorizedError } from "@/errors/unauthorized";
import { JWTService } from "./jwt";

const jwtService = new JWTService();

export async function getAuthenticatedUser(
    request: Request
) {
    const authHeader =
        request.headers.get("authorization");

    if (!authHeader) {
        throw new UnauthorizedError("Token não informado");
    }

    const token =
        authHeader.replace("Bearer ", "");

    try {
        return await jwtService.verifyToken(token);

    } catch {
        throw new UnauthorizedError("Token Inválido")
    }
}