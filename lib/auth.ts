import { JWTService } from "./jwt";

const jwtService = new JWTService();
export async function getAuthenticatedUser(request: Request) {
    const authHeader = request.headers.get("authorization");

    if(!authHeader) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.replace("Bearer ", "");

    return jwtService.verifyToken(token);
}