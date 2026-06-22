import { CourseStatus } from "@/app/generated/prisma";
import z from "zod";

export const createCourseSchema = z.object({
    title: z
        .string()
        .min(5, "Título deve possuir ao menos 5 caracteres"),
    description: z
        .string()
        .min(20, "Descrição precisa conter ao menos 20 caracteres"),
    instructorId: z
        .string()
})


export const updateCourseSchema = z.object({
    title: z
        .string()
        .min(5, "Título deve possuir ao menos 5 caracteres"),
    description: z
        .string(),
    status: z
        .enum([
            "DRAFT",
            "PUBLISHED",
            "ARCHIVED"
        ])
});