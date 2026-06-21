import { getAuthenticatedUser } from "@/lib/auth";
import { UserService } from "@/service/user.service";

const userService = new UserService();

export async function GET(request: Request) {
    const user = await getAuthenticatedUser(request);

    const users = await userService.getAllUsers(user);
    return Response.json(users);
}

export async function POST(request: Request) {
    const body = await request.json();
    const user = await userService.createUser(body);

    if (!user) {
        throw new Error("Dados Faltosos");
    }
    
    return Response.json(user);
}

export async function PUT(request: Request){
    const user = await getAuthenticatedUser(request);
    const body = await request.json();

    const newUser = await userService.updateUser(user, body);

    return Response.json(newUser);
}

export async function DELETE(request: Request) {
    const user = await getAuthenticatedUser(request);
    const body = await request.json();

    const id = body.id;

    const deleted = await userService.deleteUserById(id, user);

    if(deleted){
        return Response.json({ message: "Usuário deletado com sucesso "})
    };
}