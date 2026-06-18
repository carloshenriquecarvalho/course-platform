import { UserRepository } from "@/repository/user.repository";
import { UserRequestDTO } from "@/types";
import { UserMapper } from "@/mappers/user.mapper";
import { UserResponseDTO } from "@/types";
import { User } from "@/app/generated/prisma";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data: UserRequestDTO){
        if(!data.name || !data.email || !data.password) {
            throw new Error("Dados obrigatórios não informados");
        }
        const user = await this.userRepository.create(data);

        const userResponse: UserResponseDTO = UserMapper.toResponse(user);
        return userResponse; 
    }

    async getAllUsers(){
        const userList: User[] = await this.userRepository.findAll();

        const userResponseList: UserResponseDTO[] = userList.map(n => UserMapper.toResponse(n));
        return userResponseList;
    }

    async updateUser(id: string, data: UserRequestDTO){
        const user = await this.userRepository.update(id, data);

        return UserMapper.toResponse(user);
    }

    async deleteUserById(id: string) {
        const userDeleted = await this.userRepository.delete(id);
        return userDeleted;
    }
}