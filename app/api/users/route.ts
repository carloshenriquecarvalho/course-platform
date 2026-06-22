import { apiHandler } from "@/lib/api-handler";
import { getAuthenticatedUser } from "@/lib/auth";
import { UserService } from "@/service/user.service";

const userService = new UserService();

export async function GET(request: Request) {
    return apiHandler(async () => {
            const user = await getAuthenticatedUser(request);
        
            const users = await userService.getAllUsers(user);
            return Response.json(users);
    });
}

export async function POST(request: Request) {
    return apiHandler(async () => {
        const body = await request.json();
        const user = await userService.createUser(body);
        
        return Response.json(user);
    })
}

export async function PUT(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
        const body = await request.json();
        const id = body.id;
    
        const newUser = await userService.updateUser(user, body, id);
    
        return Response.json(newUser);
    });
}

export async function DELETE(request: Request) {
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
        const body = await request.json();
    
        const id = body.id;
    
        const deleted = await userService.deleteUserById(id, user);
    
        return Response.json(deleted);

    });
}