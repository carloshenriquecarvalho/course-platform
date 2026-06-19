import { AttachmentService } from "@/service/attachment.service";


const attachmentService = new AttachmentService();

export async function POST(request: Request){
    const formData = await request.formData();

    const attachment = await attachmentService.uploadFile(formData);
    return Response.json(attachment);
}

export async function GET() {
    const attachments =  await attachmentService.getAll();
    return Response.json(attachments);
}

export async function DELETE(request: Request){
    const body = await request.json();
    const id = body.id;
    const deleted = await attachmentService.deleteAttachment(id);
    return Response.json(deleted)
}