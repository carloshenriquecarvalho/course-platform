import { supabase } from "@/lib/supababse";

export class StorageService {
    
    async upload(file: File, path: string) {
        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        const { error } = await supabase.storage.from("course-files").upload(path, buffer, {
            contentType: file.type
        });

        if(error) {
            throw new Error(error.message)
        }

        return path;
    }

    async delete(filePath: string){
        await supabase.storage.from("attachments").remove([filePath]);
    }
}

