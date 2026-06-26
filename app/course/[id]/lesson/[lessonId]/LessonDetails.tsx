'use client'

import { SquarePlay, Clock, Paperclip, ChevronLeft, CheckCircle, CheckCircle2, Download, Loader2 } from "lucide-react"
import useFetchData from "@/app/hooks/useFetchData";
import { Lesson } from "@/app/types";
import { useRouter, useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import EmptyState from "@/app/components/ui/EmptyState";
import { useAuth } from "@/app/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";

interface Props {
    lessonId: string;
}

export function LessonDetails({ lessonId }: Props) {
    useAuth();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const courseId = params?.id;

    const { data: lesson, loading, error} = useFetchData<Lesson>({
        url: `/api/lessons/${lessonId}`
    });

    // ── Completion state ──────────────────────────────────────────────────────
    const storageKey = `lesson-completed-${lessonId}`;

    const [isCompleted, setIsCompleted] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [completionError, setCompletionError] = useState<string | null>(null);
    const [progressPercent, setProgressPercent] = useState(0);

    // Rehydrate from localStorage when lessonId changes
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        setIsCompleted(stored === "true");
        setCompletionError(null);
    }, [lessonId, storageKey]);

    const handleCompleteLesson = useCallback(async () => {
        if (isCompleted || isCompleting) return;

        setIsCompleting(true);
        setCompletionError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/lessons/${lessonId}/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Não foi possível marcar a aula como concluída.");
            }

            setIsCompleted(true);
            localStorage.setItem(storageKey, "true");

            // Recalcula o progresso e persiste para o CourseCard no dashboard
            if (lesson && courseId) {
                const mods = lesson.module.course?.modules ?? [];
                const total = mods.reduce((acc, m) => acc + m.lessons.length, 0);
                const done = mods.reduce((acc, m) =>
                    acc + m.lessons.filter((l) =>
                        localStorage.getItem(`lesson-completed-${l.id}`) === "true"
                    ).length,
                0);
                const newPercent = total > 0 ? Math.round((done / total) * 100) : 0;
                setProgressPercent(newPercent);
                localStorage.setItem(`course-progress-${courseId}`, String(newPercent));
            }
        } catch (err) {
            setCompletionError(err instanceof Error ? err.message : "Erro desconhecido.");
        } finally {
            setIsCompleting(false);
        }
    }, [lessonId, isCompleted, isCompleting, storageKey, lesson, courseId]);

    // Inicializa/atualiza progressPercent sempre que lesson carregar ou isCompleted mudar
    // Também grava course-progress-{courseId} para o CourseCard no dashboard
    useEffect(() => {
        if (!lesson || !courseId) return;
        const mods = lesson.module.course?.modules ?? [];
        const total = mods.reduce((acc, m) => acc + m.lessons.length, 0);
        const done = mods.reduce((acc, m) =>
            acc + m.lessons.filter((l) =>
                localStorage.getItem(`lesson-completed-${l.id}`) === "true"
            ).length,
        0);
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
        setProgressPercent(percent);
        localStorage.setItem(`course-progress-${courseId}`, String(percent));
    }, [lesson, lessonId, isCompleted, courseId]);

    // ─────────────────────────────────────────────────────────────────────────

    if(loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <LoadingSpinner size="lg" text="Carregando aula..." />
            </div>
        )
    }

    if(error) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <EmptyState title="Erro ao carregar" description={error} />
            </div>
        )
    }

    if(!lesson) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <EmptyState title="Aula não encontrada" description="Esta aula não existe ou foi removida." />
            </div>
        )
    }


    const currentModule = lesson.module;
    const allModules = lesson.module.course?.modules ?? [];
    const hasAttachments = lesson.attachments && lesson.attachments.length > 0;
    const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = allModules.reduce((acc, m) =>
        acc + m.lessons.filter((l) =>
            localStorage.getItem(`lesson-completed-${l.id}`) === "true"
        ).length,
    0);

    function formatFileSize(bytes?: number): string {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top bar */}
                <header className="h-14 shrink-0 border-b border-white/5 flex items-center px-5 gap-4 bg-sidebar/80 backdrop-blur-sm">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors group shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Voltar ao curso
                    </button>
                    <div className="h-4 w-px bg-white/10 shrink-0" />
                    <p className="text-sm text-white/50 truncate">
                        <span className="text-white/25 mr-1">{currentModule.title} /</span>
                        {lesson.title}
                    </p>
                </header>

                {/* Video player */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {/* Video container */}
                    <div className="w-full bg-black">
                        <div className="relative max-w-5xl mx-auto aspect-video">
                            <iframe
                                src={lesson.videoPath}
                                title={lesson.title}
                                className="absolute inset-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    {/* Lesson info */}
                    <div className="max-w-5xl mx-auto px-5 py-6 space-y-5">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <h1 className="font-heading text-xl font-bold text-white leading-snug">
                                    {lesson.title}
                                </h1>
                                <div className="flex items-center gap-3 mt-2 text-xs text-white/35">
                                    {lesson.duration && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {lesson.duration} min
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle className="w-3.5 h-3.5 text-amber-400/50" />
                                        Aula {lesson.order}
                                    </span>
                                </div>
                            </div>

                            {/* ── Complete button ── */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                {isCompleted ? (
                                    // Aula já concluída
                                    <div
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-semibold
                                                   bg-emerald-500/12 border border-emerald-500/25 text-emerald-400
                                                   cursor-default select-none"
                                    >
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        Aula concluída
                                    </div>
                                ) : (
                                    // Botão para concluir
                                    <button
                                        onClick={handleCompleteLesson}
                                        disabled={isCompleting}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-semibold
                                                   gold-gradient text-black transition-all duration-200
                                                   hover:opacity-90 hover:-translate-y-0.5
                                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                                        style={{ boxShadow: "0 4px 16px oklch(0.72 0.15 85 / 0.25)" }}
                                    >
                                        {isCompleting ? (
                                            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        )}
                                        {isCompleting ? "Salvando..." : "Marcar como concluída"}
                                    </button>
                                )}

                                {/* Inline error */}
                                {completionError && (
                                    <p className="text-xs text-red-400/70">{completionError}</p>
                                )}
                            </div>
                        </div>

                        {/* Course progress bar */}
                        <div className="rounded-xl border border-white/6 bg-white/3 px-4 py-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-white/40 font-medium">Progresso do curso</span>
                                <span className={`font-heading font-semibold ${progressPercent === 100 ? "text-emerald-400" : "text-amber-400"}`}>
                                    {progressPercent}%
                                    <span className="text-white/25 font-normal ml-1">
                                        ({completedLessons}/{totalLessons} aulas)
                                    </span>
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/6 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                                        progressPercent === 100 ? "bg-emerald-400" : "gold-gradient"
                                    }`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {lesson.description && (
                            <p className="text-white/50 text-sm leading-relaxed max-w-3xl border-t border-white/5 pt-5">
                                {lesson.description}
                            </p>
                        )}

                        {/* Attachments */}
                        {hasAttachments && (
                            <div className="border-t border-white/5 pt-5">
                                <h2 className="font-heading text-sm font-semibold text-white/70 flex items-center gap-2 mb-3">
                                    <Paperclip className="w-4 h-4 text-amber-400/60" />
                                    Material de apoio
                                </h2>
                                <div className="space-y-2">
                                    {lesson.attachments!.map((att) => (
                                        <a
                                            key={att.id}
                                            href={att.filePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/3 hover:bg-amber-400/6 hover:border-amber-400/20 transition-all duration-200 group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/15 flex items-center justify-center shrink-0">
                                                <Download className="w-3.5 h-3.5 text-amber-400/70" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white/70 group-hover:text-white/90 truncate transition-colors">
                                                    {att.fileName}
                                                </p>
                                                {att.fileSize && (
                                                    <p className="text-xs text-white/25 mt-0.5">
                                                        {formatFileSize(att.fileSize)}
                                                    </p>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar — course navigation */}
            <aside className="w-72 h-full shrink-0 border-l border-white/6 hidden lg:flex flex-col bg-sidebar overflow-hidden">
                {/* Sidebar header com progresso */}
                <div className="px-4 py-4 border-b border-white/5 shrink-0 space-y-3">
                    <div>
                        <h2 className="font-heading text-sm font-semibold text-white/70">Conteúdo do Curso</h2>
                        <p className="text-xs text-white/30 mt-0.5">
                            {allModules.reduce((a, m) => a + m.lessons.length, 0)} aulas ·{" "}
                            {allModules.length} módulos
                        </p>
                    </div>

                    {/* Mini progress bar na sidebar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-white/30">Seu progresso</span>
                            <span className={progressPercent === 100 ? "text-emerald-400" : "text-amber-400/80"}>
                                {progressPercent}%
                            </span>
                        </div>
                        <div className="h-1 w-full bg-white/6 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                    progressPercent === 100 ? "bg-emerald-400" : "gold-gradient"
                                }`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <Accordion
                        type="multiple"
                        defaultValue={[currentModule.id]}
                        className="w-full"
                    >
                        {allModules.map((module) => {
                            const isCurrentModule = module.id === currentModule.id;
                            return (
                                <AccordionItem
                                    key={module.id}
                                    value={module.id}
                                    className="border-b border-white/5 last:border-0"
                                >
                                    <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-white/3 transition-colors cursor-pointer">
                                        <div className="text-left">
                                            <p className={`text-sm font-heading font-medium leading-snug ${isCurrentModule ? "text-amber-400" : "text-white/60"}`}>
                                                {module.title}
                                            </p>
                                            <p className="text-[10px] text-white/25 mt-0.5">
                                                {module.lessons.length} {module.lessons.length === 1 ? "aula" : "aulas"}
                                            </p>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="pb-2">
                                        <ul>
                                            {module.lessons.map((lsn) => {
                                                const isActive = lsn.id === lessonId;
                                                const lsnCompleted =
                                                    localStorage.getItem(`lesson-completed-${lsn.id}`) === "true";

                                                return (
                                                    <li key={lsn.id}>
                                                        <button
                                                            onClick={() =>
                                                                router.push(
                                                                    `/course/${module.courseId}/lesson/${lsn.id}`
                                                                )
                                                            }
                                                            className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-all duration-150 group ${
                                                                isActive
                                                                    ? "bg-amber-400/8 border-r-2 border-amber-400"
                                                                    : "hover:bg-white/3"
                                                            }`}
                                                        >
                                                            {/* Ícone: concluída / ativa / normal */}
                                                            {lsnCompleted ? (
                                                                <CheckCircle2
                                                                    className="w-3.5 h-3.5 shrink-0 text-emerald-400"
                                                                />
                                                            ) : (
                                                                <SquarePlay
                                                                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                                                        isActive
                                                                            ? "text-amber-400"
                                                                            : "text-white/20 group-hover:text-amber-400/50"
                                                                    }`}
                                                                />
                                                            )}

                                                            <span
                                                                className={`text-xs leading-snug flex-1 ${
                                                                    lsnCompleted
                                                                        ? "text-white/40 line-through decoration-white/20"
                                                                        : isActive
                                                                        ? "text-amber-400 font-medium"
                                                                        : "text-white/45 group-hover:text-white/80"
                                                                }`}
                                                            >
                                                                {lsn.title}
                                                            </span>

                                                            {lsn.duration && (
                                                                <span className="text-[10px] text-white/20 shrink-0">
                                                                    {lsn.duration}m
                                                                </span>
                                                            )}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
            </aside>
        </div>
    )
}