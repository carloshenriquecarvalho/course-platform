import { LoginService } from "@/service/login.service"

const loginService: LoginService = new LoginService();
export async function POST(request: Request){
    const body = await request.json();

    return await loginService.authenticate(body);
}