import { AttachmentRepository } from "@/repository/attachement.repository";
import { StorageService } from "./storage.service";
import { TokenPayload } from "@/types";
import { requireRole } from "@/lib/authorization";
import { NotFoundError } from "@/errors/notfound";

export class AttachmentService {
    private attachmentRepository: AttachmentRepository = new AttachmentRepository();
    private storageService: StorageService = new StorageService();
    
    constructor() {
    }

    async uploadFile(formData: FormData, user: TokenPayload) {
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        const file = formData.get("file") as File;
        if (!(file instanceof File)) {
            throw new Error("Arquivo não enviado");
        }
        const lessonId = formData.get("lessonId") as string;
        if (!lessonId) {
            throw new Error("ID da aula não encontrado");
        }

        const filePath = `lessons/${lessonId}/${Date.now()}-${file.name}`
        try {
            await this.storageService.upload(file, filePath)
            
            return await this.attachmentRepository.create({
                filePath: filePath,
                lessonId: lessonId,
                fileName: file.name,
                fileSize: file.size
            });
        } catch(error) {
            await this.storageService.delete(filePath);
            throw error;
        }

    }

    async getAll(user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        return await this.attachmentRepository.get();
    }

    async deleteAttachment(id: string, user: TokenPayload){
        requireRole(user, [
            "ADMIN",
            "INSTRUCTOR"
        ]);

        const existingAttachment = await this.attachmentRepository.findById(id);
        if(!existingAttachment) {
            throw new NotFoundError("Anexo não encontrado.")
        }

        return await this.attachmentRepository.delete(id);
    }
}