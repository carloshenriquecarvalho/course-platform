import { prisma } from "@/lib/prisma";
import { AttachmentRequest } from "@/types";

export class AttachmentRepository {
    constructor() {
    }

    async create(attachment: AttachmentRequest){
        return await prisma.attachment.create({
            data:{
                filePath: attachment.filePath,
                lessonId: attachment.lessonId,
                fileName: attachment.fileName,
                fileSize: attachment.fileSize
            }   
        });
    }

    async get() {
        return await prisma.attachment.findMany();
    }

    async delete(id: string){
        return await prisma.attachment.delete({
            where: {
                id: id
            }
        });
    }

    async findById(id: string) {
        return prisma.attachment.findUnique({
            where: {id}
        });
    }
}