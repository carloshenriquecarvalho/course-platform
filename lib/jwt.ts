import { TokenPayload } from "@/types";
import jwt from "jsonwebtoken"

export class JWTService {
    async signToken(userId: string, role: string){
        const token = jwt.sign({
            sub: userId,
            role: role
        },
        process.env.JWT_SECRET_KEY!,
        {
            expiresIn: "2d"
        });

        return {token, role};
    }

    async verifyToken(token: string): Promise<TokenPayload>{
        return jwt.verify(
            token,
            process.env.JWT_SECRET_KEY!
        ) as TokenPayload;
    }
}