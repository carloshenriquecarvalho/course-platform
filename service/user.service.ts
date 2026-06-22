import { UserRepository } from "@/repository/user.repository";
import { TokenPayload, UserRequestDTO } from "@/types";
import { UserMapper } from "@/mappers/user.mapper";
import { UserResponseDTO } from "@/types";
import { User } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/authorization";
import { NotFoundError } from "@/errors/notfound";
import { BadRequestError } from "@/errors/badrequest";
import { AdminUserRequestDTO } from "@/types";
import { ConflictError } from "@/errors/conflict";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data: UserRequestDTO){
        if(!data.name || !data.email || !data.password) {
            throw new BadRequestError("Dados obrigatórios não informados");
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

    async updateUser(user: TokenPayload, data: UserRequestDTO, id: string){
        
        if(user.sub !== id) {
            requireRole(user, [
                "ADMIN"
            ]);
            
            const existingUser = this.userRepository.findById(id);
            if(!existingUser) {
                throw new NotFoundError("Usuário não encontrado");
            }
        }

        const userUpdated = await this.userRepository.update(user.sub, data);

        return UserMapper.toResponse(userUpdated);
    }

    async deleteUserById(id: string, user: TokenPayload) {
        if(id !== user.sub) {
            requireRole(user, ["ADMIN"]);
        }

        const userToDelete = await this.userRepository.findById(id);

        if(!userToDelete){
            throw new NotFoundError("Usuário não encontrado");
        }

        const userDeleted = await this.userRepository.delete(id);
        return userDeleted;
    }

    async adminCreateUser(payload: AdminUserRequestDTO, user: TokenPayload) {
        if(!payload) {
            throw new BadRequestError("Dados faltosos para criação de usuário");
        }

        requireRole(user, [
            "ADMIN"
        ]);

        const hashedPassword = await bcrypt.hash(payload.password, 10);

        payload.password = hashedPassword;

        const existingUser = await this.userRepository.findByEmail(payload.email);
        if(existingUser) {
            throw new ConflictError("Usuário já existe");
        }

        const userCreated = await this.userRepository.adminCreate(payload);
        return userCreated;
    };

}