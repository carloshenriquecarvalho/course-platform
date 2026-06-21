import z from "zod";

export const createLessonSchema = z.object({
    title: z
        .string()
        .min(5, "Título precisa conter ao menos 5 caracteres"),
    description: z
        .string()
        .min(20, "Descrição precisa conter ao menos 20 caracteres"),
    moduleId: z
        .string(),
    duration: z
        .number(),
    videoPath: z
        .string(),
    order: z
        .number(),

});