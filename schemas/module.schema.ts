import z from "zod";

export const createModuleSchema = z.object({
    title: z
        .string()
        .min(15, "Título precisa conter ao menos 15 caracteres")
});