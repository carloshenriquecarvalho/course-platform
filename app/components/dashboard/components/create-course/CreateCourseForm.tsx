"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import StepIndicator from "./StepIndicator";
import StepCourseInfo from "./StepCourseInfo";
import StepModules, { ModuleData } from "./StepModules";
import StepLessons, { LessonData } from "./StepLessons";
import StepReview from "./StepReview";
import useFetchData from "@/app/hooks/useFetchData";
import { decodeToken } from "@/app/hooks/useAuth";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CourseFormData {
    title: string;
    description: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    instructorId: string;
}

// ─── Steps config ───────────────────────────────────────────────────────────

const STEPS = [
    { id: 1, label: "Curso",    description: "Dados gerais"  },
    { id: 2, label: "Módulos",  description: "Organização"   },
    { id: 3, label: "Aulas",    description: "Conteúdo"      },
    { id: 4, label: "Revisão",  description: "Confirmar"     },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function uid() {
    return Math.random().toString(36).slice(2);
}

// ─── Validation ─────────────────────────────────────────────────────────────

function validateCourseInfo(data: CourseFormData, isAdmin: boolean): Partial<Record<keyof CourseFormData, string>> {
    const errs: Partial<Record<keyof CourseFormData, string>> = {};
    if (data.title.length < 5)        errs.title       = "Título deve ter ao menos 5 caracteres";
    if (data.description.length < 20) errs.description  = "Descrição deve ter ao menos 20 caracteres";
    if (isAdmin && !data.instructorId.trim()) errs.instructorId = "Informe o ID do instrutor";
    return errs;
}

function validateModules(modules: ModuleData[]): Record<string, string> {
    const errs: Record<string, string> = {};
    modules.forEach((m) => {
        if (m.title.trim().length < 15) {
            errs[m.tempId] = "Título deve ter ao menos 15 caracteres";
        }
    });
    return errs;
}

function validateLessons(lessons: LessonData[]): Record<string, Partial<Record<keyof LessonData, string>>> {
    const errs: Record<string, Partial<Record<keyof LessonData, string>>> = {};
    lessons.forEach((l) => {
        const lErrs: Partial<Record<keyof LessonData, string>> = {};
        if (l.title.trim().length < 5)       lErrs.title       = "Mínimo 5 caracteres";
        if (l.description.trim().length < 20) lErrs.description = "Mínimo 20 caracteres";
        if (!l.duration || isNaN(Number(l.duration)) || Number(l.duration) <= 0) {
            lErrs.duration = "Duração é obrigatória e deve ser > 0";
        }
        if (Object.keys(lErrs).length) errs[l.tempId] = lErrs;
    });
    return errs;
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function CreateCourseForm() {
    const router = useRouter();

    // ── Form state ──
    const [step, setStep]             = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError]   = useState<string | null>(null);
    const [success, setSuccess]           = useState(false);
    const isSubmittingRef                 = useRef(false);

    // Get role and sub lazily from token
    const [userAuth] = useState(() => {
        if (typeof window === "undefined") return { role: "", sub: "" };
        const token = localStorage.getItem("token");
        if (!token) return { role: "", sub: "" };
        const payload = decodeToken(token);
        if (!payload) return { role: "", sub: "" };
        return { role: payload.role, sub: payload.sub };
    });
    
    const isAdmin = userAuth.role === "ADMIN";

    const { data: usersData, loading: loadingUsers, error: usersError } = useFetchData<any[]>({
        url: isAdmin ? "/api/users" : "" // only fetch if admin
    });

    const [courseData, setCourseData] = useState<CourseFormData>({
        title: "",
        description: "",
        status: "DRAFT",
        instructorId: "",
    });

    const [modules, setModules]   = useState<ModuleData[]>([]);
    const [lessons, setLessons]   = useState<LessonData[]>([]);

    // ── Validation errors ──
    const [courseErrors,  setCourseErrors]  = useState<Partial<Record<keyof CourseFormData, string>>>({});
    const [moduleErrors,  setModuleErrors]  = useState<Record<string, string>>({});
    const [lessonErrors,  setLessonErrors]  = useState<Record<string, Partial<Record<keyof LessonData, string>>>>({});

    // ─── Course handlers ─────────────────────────────────────────────────────

    function handleCourseChange(partial: Partial<CourseFormData>) {
        setCourseData((prev) => ({ ...prev, ...partial }));
    }

    // ─── Module handlers ──────────────────────────────────────────────────────

    function addModule() {
        const tempId = uid();
        setModules((prev) => [
            ...prev,
            { tempId, title: "", order: prev.length + 1 },
        ]);
    }

    function removeModule(tempId: string) {
        setModules((prev) => prev.filter((m) => m.tempId !== tempId));
        setLessons((prev) => prev.filter((l) => l.moduleTempId !== tempId));
    }

    function updateModule(tempId: string, title: string) {
        setModules((prev) =>
            prev.map((m) => (m.tempId === tempId ? { ...m, title } : m))
        );
    }

    // ─── Lesson handlers ──────────────────────────────────────────────────────

    function addLesson(moduleTempId: string) {
        const moduleIndex = lessons.filter((l) => l.moduleTempId === moduleTempId).length;
        setLessons((prev) => [
            ...prev,
            {
                tempId: uid(),
                moduleTempId,
                title: "",
                description: "",
                videoPath: "",
                duration: "",
                order: moduleIndex + 1,
            },
        ]);
    }

    function removeLesson(tempId: string) {
        setLessons((prev) => prev.filter((l) => l.tempId !== tempId));
    }

    function updateLesson(tempId: string, field: Partial<LessonData>) {
        setLessons((prev) =>
            prev.map((l) => (l.tempId === tempId ? { ...l, ...field } : l))
        );
    }

    // ─── Navigation ───────────────────────────────────────────────────────────

    function handleNext() {
        if (step === 1) {
            const errs = validateCourseInfo(courseData, isAdmin);
            setCourseErrors(errs);
            if (Object.keys(errs).length) return;
        }
        if (step === 2) {
            if (modules.length === 0) return; // require at least 1 module
            const errs = validateModules(modules);
            setModuleErrors(errs);
            if (Object.keys(errs).length) return;
        }
        if (step === 3) {
            const errs = validateLessons(lessons);
            setLessonErrors(errs);
            if (Object.keys(errs).length) return;
        }
        setStep((s) => Math.min(s + 1, STEPS.length));
    }

    function handleBack() {
        setStep((s) => Math.max(s - 1, 1));
    }

    // ─── Submit API Integration ───────────────────────────────────────────────

    async function handleSubmit() {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Não autenticado");

            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            // 1. Create Course
            const coursePayload = {
                title: courseData.title,
                description: courseData.description,
                status: courseData.status,
                ...(isAdmin && { instructorId: courseData.instructorId })
            };

            const courseRes = await fetch("/api/courses", {
                method: "POST",
                headers,
                body: JSON.stringify(coursePayload)
            });
            if (!courseRes.ok) {
                const errData = await courseRes.json().catch(() => ({}));
                throw new Error(errData.message || "Erro ao criar curso");
            }
            const createdCourse = await courseRes.json();
            const courseId = createdCourse.id;

            // 2. Create Modules
            for (const mod of modules) {
                const modRes = await fetch("/api/modules", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        title: mod.title,
                        order: mod.order,
                        courseId
                    })
                });
                if (!modRes.ok) throw new Error(`Erro ao criar módulo: ${mod.title}`);
                const createdModule = await modRes.json();
                const moduleId = createdModule.id;

                // 3. Create Lessons for this Module
                const modLessons = lessons.filter(l => l.moduleTempId === mod.tempId);
                for (const lesson of modLessons) {
                    const lessonRes = await fetch("/api/lessons", {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                            title: lesson.title,
                            description: lesson.description,
                            videoPath: lesson.videoPath || undefined,
                            duration: lesson.duration || undefined,
                            order: lesson.order,
                            moduleId
                        })
                    });
                    if (!lessonRes.ok) throw new Error(`Erro ao criar aula: ${lesson.title}`);
                }
            }

            setSuccess(true);
            setTimeout(() => router.push("/dashboard"), 1800);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Erro desconhecido ao criar curso");
            isSubmittingRef.current = false;
        } finally {
            setIsSubmitting(false);
        }
    }

    // ─── Success screen ───────────────────────────────────────────────────────

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center gap-5 py-24 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center shadow-lg"
                    style={{ boxShadow: "0 8px 24px oklch(0.72 0.15 85 / 0.35)" }}>
                    <CheckCircle2 className="w-8 h-8 text-black" />
                </div>
                <div className="text-center space-y-1">
                    <h2 className="font-heading text-xl font-semibold text-white">Curso criado com sucesso!</h2>
                    <p className="text-sm text-white/40">Redirecionando para o dashboard...</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin mt-2" />
            </div>
        );
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full animate-slideUp">
            {/* Step indicator */}
            <StepIndicator steps={STEPS} currentStep={step} />

            {/* Card */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8 space-y-8">
                {/* Step content */}
                {step === 1 && (
                    <StepCourseInfo
                        data={courseData}
                        onChange={handleCourseChange}
                        errors={courseErrors}
                        isAdmin={isAdmin}
                        users={usersData || []}
                        loadingUsers={loadingUsers}
                        usersError={usersError}
                    />
                )}
                {step === 2 && (
                    <StepModules
                        modules={modules}
                        onAdd={addModule}
                        onRemove={removeModule}
                        onUpdate={updateModule}
                        errors={moduleErrors}
                    />
                )}
                {step === 3 && (
                    <StepLessons
                        modules={modules}
                        lessons={lessons}
                        onAddLesson={addLesson}
                        onRemoveLesson={removeLesson}
                        onUpdateLesson={updateLesson}
                        errors={lessonErrors}
                    />
                )}
                {step === 4 && (
                    <StepReview
                        course={courseData}
                        modules={modules}
                        lessons={lessons}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
                    />
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 disabled:opacity-0 disabled:pointer-events-none transition-all duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </button>

                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-400 text-black hover:bg-amber-300 active:scale-95 transition-all duration-200"
                            style={{ boxShadow: "0 4px 16px oklch(0.72 0.15 85 / 0.35)" }}
                        >
                            Continuar
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-400 text-black hover:bg-amber-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                            style={{ boxShadow: "0 4px 16px oklch(0.72 0.15 85 / 0.35)" }}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Criar Curso
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
