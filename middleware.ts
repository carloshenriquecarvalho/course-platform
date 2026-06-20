import { NextRequest, NextResponse } from "next/server";
import { JWTService } from "./lib/jwt";


const jwtService = new JWTService();

export function middleware(request: NextRequest){
    const authHeader = request.headers.get("authorization");


    if(!authHeader) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        jwtService.verifyToken(token);

        return NextResponse.next();
    } catch {
        return NextResponse.json(
            { message: "invalid token" },
            { status: 401 }
        )
    }
}

export const config = {
    matcher: [
        "/api/courses/:path*",
        "/api/modules/:path*",
        "/api/lessons/:path*",
        "/api/users/:path*",
        "/api/attachments/:path*"

    ],
};