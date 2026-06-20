import { LoginRepository } from "@/repository/login.repository"
import { LoginRequestDTO } from "@/types";
import bcrypt from "bcryptjs";
import { JWTService } from "@/lib/jwt";
import { LoginResponseDTO } from "@/types";

export class LoginService {
    private tokenSign = new JWTService();
    private loginRepository = new LoginRepository();

    async authenticate(loginData: LoginRequestDTO){
        const user = await this.loginRepository.findUser(loginData.email);

        if(!user) {
            throw new Error("Usuário não existe");
        }

        const passwordValidate = await bcrypt.compare(loginData.password, user.password);

        if(!passwordValidate){
            throw new Error("Credenciais inválidas");
        }

        const token: LoginResponseDTO = await this.tokenSign.signToken(user.id, user.role);
        
        return await this.tokenSign.signToken(user.id, user.role);

    }
}