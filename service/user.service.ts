import { UserRepository } from "@/repository/user.repository";
import { TokenPayload, UserRequestDTO } from "@/types";
import { UserMapper } from "@/mappers/user.mapper";
import { UserResponseDTO } from "@/types";
import { User } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/authorization";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data: UserRequestDTO){
        if(!data.name || !data.email || !data.password) {
            throw new Error("Dados obrigatórios não informados");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        data.password = hashedPassword;

        const user = await this.userRepository.create(data);

        const userResponse: UserResponseDTO = UserMapper.toResponse(user);
        return userResponse; 
    }

    async getAllUsers(user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        const userList: User[] = await this.userRepository.findAll();

        const userResponseList: UserResponseDTO[] = userList.map(n => UserMapper.toResponse(n));
        return userResponseList;
    }

    async updateUser(user: TokenPayload, data: UserRequestDTO){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR",
            "USER"
        ]);

        const userUpdated = await this.userRepository.update(user.sub, data);

        return UserMapper.toResponse(userUpdated);
    }

    async deleteUserById(id: string, user: TokenPayload) {
        if(id !== user.sub) {
            requireRole(user, ["ADMIN"]);
        }
        const userDeleted = await this.userRepository.delete(id);
        return userDeleted;
    }
}