import { apiHandler } from "@/lib/api-handler";
import { LoginService } from "@/service/login.service"

const loginService: LoginService = new LoginService();
export async function POST(request: Request){
    return apiHandler(async () => {
        const body = await request.json();
    
        const token = await loginService.authenticate(body);
    
        return Response.json({token: `${token}`});
    });
}