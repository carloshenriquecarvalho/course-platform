import { apiHandler } from "@/lib/api-handler";
import { getAuthenticatedUser } from "@/lib/auth";
import { UserService } from "@/service/user.service";

const userService = new UserService();
export async function POST(request: Request){
    return apiHandler(async () => {
        const user = await getAuthenticatedUser(request);
        const body = await request.json();
        const newUser = await userService.adminCreateUser(body, user);

        return Response.json(newUser);
    });
}