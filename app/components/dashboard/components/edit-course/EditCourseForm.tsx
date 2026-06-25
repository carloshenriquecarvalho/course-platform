"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Save, ArrowLeft } from "lucide-react";
import StepCourseInfo from "../create-course/StepCourseInfo";
import StepModules, { ModuleData } from "../create-course/StepModules";
import StepLessons, { LessonData } from "../create-course/StepLessons";
import useFetchData from "@/app/hooks/useFetchData";

interface CourseFormData {
    title: string;
    description: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    instructorId: string;
}

function uid() {
    return Math.random().toString(36).slice(2);
}

function isNew(id: string) {
    return id.length < 15; // UUIDs are 36 chars. Our uid() is around 10-12.
}

export default function EditCourseForm({ initialData, userAuth }: { initialData: any, userAuth: any }) {
    const router = useRouter();
    const isAdmin = userAuth.role === "ADMIN";

    const { data: usersData, loading: loadingUsers, error: usersError } = useFetchData<any[]>({
        url: isAdmin ? "/api/users" : ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError]   = useState<string | null>(null);
    const [success, setSuccess]           = useState(false);
    const isSubmittingRef                 = useRef(false);

    // Initial State mapping
    const [courseData, setCourseData] = useState<CourseFormData>({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "DRAFT",
        instructorId: initialData.instructorId || "",
    });

    const [modules, setModules] = useState<ModuleData[]>(
        (initialData.modules || []).map((m: any) => ({
            tempId: m.id,
            title: m.title,
            order: m.order
        }))
    );

    const [lessons, setLessons] = useState<LessonData[]>(
        (initialData.modules || []).flatMap((m: any) => 
            (m.lessons || []).map((l: any) => ({
                tempId: l.id,
                moduleTempId: m.id,
                title: l.title,
                description: l.description || "",
                videoPath: l.videoPath || "",
                duration: l.duration || "",
                order: l.order
            }))
        )
    );

    // Track original IDs for deletion detection
    const [originalModuleIds] = useState<Set<string>>(new Set(modules.map(m => m.tempId)));
    const [originalLessonIds] = useState<Set<string>>(new Set(lessons.map(l => l.tempId)));

    const [courseErrors, setCourseErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
    const [moduleErrors, setModuleErrors] = useState<Record<string, string>>({});
    const [lessonErrors, setLessonErrors] = useState<Record<string, Partial<Record<keyof LessonData, string>>>>({});

    // Handlers
    function handleCourseChange(partial: Partial<CourseFormData>) {
        setCourseData((prev) => ({ ...prev, ...partial }));
    }

    function addModule() {
        setModules((prev) => [...prev, { tempId: uid(), title: "", order: prev.length + 1 }]);
    }

    function removeModule(tempId: string) {
        setModules((prev) => prev.filter((m) => m.tempId !== tempId));
        setLessons((prev) => prev.filter((l) => l.moduleTempId !== tempId));
    }

    function updateModule(tempId: string, title: string) {
        setModules((prev) => prev.map((m) => (m.tempId === tempId ? { ...m, title } : m)));
    }

    function addLesson(moduleTempId: string) {
        const moduleIndex = lessons.filter((l) => l.moduleTempId === moduleTempId).length;
        setLessons((prev) => [
            ...prev,
            { tempId: uid(), moduleTempId, title: "", description: "", videoPath: "", duration: "", order: moduleIndex + 1 }
        ]);
    }

    function removeLesson(tempId: string) {
        setLessons((prev) => prev.filter((l) => l.tempId !== tempId));
    }

    function updateLesson(tempId: string, field: Partial<LessonData>) {
        setLessons((prev) => prev.map((l) => (l.tempId === tempId ? { ...l, ...field } : l)));
    }

    async function handleSave() {
        if (isSubmittingRef.current) return;

        // Validation
        let hasErrors = false;
        
        // Course validation
        const cErrs: any = {};
        if (courseData.title.length < 5) cErrs.title = "Título deve ter ao menos 5 caracteres";
        if (courseData.description.length < 20) cErrs.description = "Descrição deve ter ao menos 20 caracteres";
        if (isAdmin && !courseData.instructorId.trim()) cErrs.instructorId = "Informe o ID do instrutor";
        setCourseErrors(cErrs);
        if (Object.keys(cErrs).length) hasErrors = true;

        // Module validation
        const mErrs: any = {};
        modules.forEach(m => { if (m.title.trim().length < 15) mErrs[m.tempId] = "Título deve ter ao menos 15 caracteres"; });
        setModuleErrors(mErrs);
        if (Object.keys(mErrs).length) hasErrors = true;

        // Lesson validation
        const lErrs: any = {};
        lessons.forEach(l => {
            const errs: any = {};
            if (l.title.trim().length < 5) errs.title = "Mínimo 5 caracteres";
            if (l.description.trim().length < 20) errs.description = "Mínimo 20 caracteres";
            if (!l.duration || isNaN(Number(l.duration)) || Number(l.duration) <= 0) errs.duration = "Duração é obrigatória e deve ser > 0";
            if (Object.keys(errs).length) lErrs[l.tempId] = errs;
        });
        setLessonErrors(lErrs);
        if (Object.keys(lErrs).length) hasErrors = true;

        if (hasErrors) {
            setSubmitError("Existem erros de validação no formulário. Verifique os campos em vermelho.");
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Não autenticado");
            const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

            // 1. Update Course
            const courseRes = await fetch("/api/courses", {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    id: initialData.id,
                    title: courseData.title,
                    description: courseData.description,
                    status: courseData.status,
                    ...(isAdmin && { instructorId: courseData.instructorId })
                })
            });
            if (!courseRes.ok) throw new Error("Erro ao atualizar curso");

            // 2. Identify Deletions
            const currentModuleIds = new Set(modules.filter(m => !isNew(m.tempId)).map(m => m.tempId));
            const currentLessonIds = new Set(lessons.filter(l => !isNew(l.tempId)).map(l => l.tempId));

            const modulesToDelete = Array.from(originalModuleIds).filter(id => !currentModuleIds.has(id));
            const lessonsToDelete = Array.from(originalLessonIds).filter(id => !currentLessonIds.has(id));

            // Delete lessons first
            for (const id of lessonsToDelete) {
                await fetch("/api/lessons", { method: "DELETE", headers, body: JSON.stringify({ id }) });
            }
            // Delete modules
            for (const id of modulesToDelete) {
                await fetch("/api/modules", { method: "DELETE", headers, body: JSON.stringify({ id }) });
            }

            // 3. Upsert Modules & Lessons
            for (const mod of modules) {
                let moduleId = mod.tempId;
                if (isNew(mod.tempId)) {
                    // Create
                    const mRes = await fetch("/api/modules", {
                        method: "POST", headers,
                        body: JSON.stringify({ title: mod.title, order: mod.order, courseId: initialData.id })
                    });
                    if (!mRes.ok) throw new Error(`Erro ao criar módulo: ${mod.title}`);
                    const createdMod = await mRes.json();
                    moduleId = createdMod.id;
                } else {
                    // Update
                    const mRes = await fetch("/api/modules", {
                        method: "PATCH", headers,
                        body: JSON.stringify({ id: moduleId, title: mod.title, order: mod.order })
                    });
                    if (!mRes.ok) throw new Error(`Erro ao atualizar módulo: ${mod.title}`);
                }

                // Process lessons for this module
                const modLessons = lessons.filter(l => l.moduleTempId === mod.tempId);
                for (const lesson of modLessons) {
                    if (isNew(lesson.tempId)) {
                        // Create
                        const lRes = await fetch("/api/lessons", {
                            method: "POST", headers,
                            body: JSON.stringify({
                                title: lesson.title, description: lesson.description, videoPath: lesson.videoPath || undefined,
                                duration: lesson.duration || undefined, order: lesson.order, moduleId
                            })
                        });
                        if (!lRes.ok) throw new Error(`Erro ao criar aula: ${lesson.title}`);
                    } else {
                        // Update
                        const lRes = await fetch("/api/lessons", {
                            method: "PATCH", headers,
                            body: JSON.stringify({
                                id: lesson.tempId, title: lesson.title, description: lesson.description,
                                videoPath: lesson.videoPath || undefined, duration: lesson.duration || undefined, order: lesson.order
                            })
                        });
                        if (!lRes.ok) throw new Error(`Erro ao atualizar aula: ${lesson.title}`);
                    }
                }
            }

            setSuccess(true);
            setTimeout(() => router.push("/dashboard"), 1500);

        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Erro desconhecido");
            isSubmittingRef.current = false;
        } finally {
            setIsSubmitting(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center gap-5 py-24 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8 text-black" />
                </div>
                <div className="text-center space-y-1">
                    <h2 className="font-heading text-xl font-semibold text-white">Curso atualizado!</h2>
                    <p className="text-sm text-white/40">Redirecionando...</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin mt-2" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-400 text-black hover:bg-amber-300 active:scale-95 disabled:opacity-60 transition-all"
                    style={{ boxShadow: "0 4px 16px oklch(0.72 0.15 85 / 0.35)" }}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Salvar Alterações
                        </>
                    )}
                </button>
            </div>

            {submitError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {submitError}
                </div>
            )}

            <div className="space-y-12">
                {/* 1. General Info */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8">
                    <h2 className="font-heading text-xl font-semibold text-white mb-6">1. Informações Gerais</h2>
                    <StepCourseInfo
                        data={courseData}
                        onChange={handleCourseChange}
                        errors={courseErrors}
                        isAdmin={isAdmin}
                        users={usersData || []}
                        loadingUsers={loadingUsers}
                        usersError={usersError}
                    />
                </div>

                {/* 2. Modules */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8">
                    <h2 className="font-heading text-xl font-semibold text-white mb-6">2. Módulos</h2>
                    <StepModules
                        modules={modules}
                        onAdd={addModule}
                        onRemove={removeModule}
                        onUpdate={updateModule}
                        errors={moduleErrors}
                    />
                </div>

                {/* 3. Lessons */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8">
                    <StepLessons
                        modules={modules}
                        lessons={lessons}
                        onAddLesson={addLesson}
                        onRemoveLesson={removeLesson}
                        onUpdateLesson={updateLesson}
                        errors={lessonErrors}
                    />
                </div>
            </div>
            
            {/* Bottom Save Button */}
            <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold bg-amber-400 text-black hover:bg-amber-300 active:scale-95 disabled:opacity-60 transition-all"
                >
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>
        </div>
    );
}
