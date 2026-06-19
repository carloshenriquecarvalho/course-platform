import { AttachmentRepository } from "@/repository/attachement.repository";
import { StorageService } from "./storage.service";

export class AttachmentService {
    private attachmentRepository: AttachmentRepository = new AttachmentRepository();
    private storageService: StorageService = new StorageService();
    
    constructor() {
    }

    async uploadFile(formData: FormData) {
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

    async getAll(){
        return this.attachmentRepository.get();
    }

    async deleteAttachment(id: string){
        return await this.attachmentRepository.delete(id);
    }
}