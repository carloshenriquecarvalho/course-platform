import { getAuthenticatedUser } from "@/lib/auth";
import { AttachmentService } from "@/service/attachment.service";


const attachmentService = new AttachmentService();

export async function POST(request: Request){
    const user = await getAuthenticatedUser(request);

    const formData = await request.formData();

    const attachment = await attachmentService.uploadFile(formData, user);
    return Response.json(attachment);
}

export async function GET(request: Request) {
    const user = await getAuthenticatedUser(request);
    const attachments =  await attachmentService.getAll(user);
    return Response.json(attachments);
}

export async function DELETE(request: Request){
    const user = await getAuthenticatedUser(request);

    const body = await request.json();
    const id = body.id;
    const deleted = await attachmentService.deleteAttachment(id, user);
    return Response.json(deleted)
}