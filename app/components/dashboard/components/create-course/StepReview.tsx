"use client";

import { BookText, Clock, Layers, Play } from "lucide-react";
import { ModuleData } from "./StepModules";
import { LessonData } from "./StepLessons";

interface CourseFormData {
    title: string;
    description: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    instructorId: string;
}

const STATUS_LABEL: Record<string, string> = {
    DRAFT: "Rascunho",
    PUBLISHED: "Publicado",
    ARCHIVED: "Arquivado",
};

const STATUS_COLOR: Record<string, string> = {
    DRAFT: "text-white/50 bg-white/5 border-white/10",
    PUBLISHED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    ARCHIVED: "text-red-400/70 bg-red-400/8 border-red-400/15",
};

interface StepReviewProps {
    course: CourseFormData;
    modules: ModuleData[];
    lessons: LessonData[];
    isSubmitting: boolean;
    submitError: string | null;
}

export default function StepReview({ course, modules, lessons, isSubmitting, submitError }: StepReviewProps) {
    const totalDuration = lessons.reduce((acc, l) => acc + (Number(l.duration) || 0), 0);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1.5">
                <h2 className="font-heading text-xl font-semibold text-white">Revisão Final</h2>
                <p className="text-sm text-white/40">
                    Confira todas as informações antes de criar o curso.
                </p>
            </div>

            {/* Course summary card */}
            <div className="p-5 bg-white/3 border border-white/8 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <BookText className="w-4 h-4 text-amber-400/70 shrink-0" />
                            <h3 className="font-heading font-semibold text-white truncate">{course.title || "—"}</h3>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{course.description || "—"}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLOR[course.status]}`}>
                        {STATUS_LABEL[course.status]}
                    </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 pt-1 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-white/35">
                        <Layers className="w-3.5 h-3.5" />
                        {modules.length} módulo{modules.length !== 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/35">
                        <Play className="w-3.5 h-3.5" />
                        {lessons.length} aula{lessons.length !== 1 ? "s" : ""}
                    </div>
                    {totalDuration > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-white/35">
                            <Clock className="w-3.5 h-3.5" />
                            {totalDuration} min total
                        </div>
                    )}
                </div>
            </div>

            {/* Module breakdown */}
            <div className="space-y-2">
                {modules.map((mod, modIndex) => {
                    const modLessons = lessons.filter((l) => l.moduleTempId === mod.tempId);
                    return (
                        <div key={mod.tempId} className="p-4 bg-white/2 border border-white/6 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-5 h-5 rounded gold-gradient flex items-center justify-center text-[10px] font-heading font-bold text-black">
                                    {modIndex + 1}
                                </span>
                                <span className="text-sm font-medium text-white/80 font-heading">
                                    {mod.title || `Módulo ${modIndex + 1}`}
                                </span>
                                <span className="ml-auto text-xs text-white/25">
                                    {modLessons.length} aula{modLessons.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            {modLessons.length > 0 && (
                                <ul className="space-y-1 ml-7">
                                    {modLessons.map((l, li) => (
                                        <li key={l.tempId} className="flex items-center gap-2 text-xs text-white/35">
                                            <span className="w-4 h-4 rounded flex items-center justify-center bg-white/5 text-[9px] text-white/25 shrink-0">
                                                {li + 1}
                                            </span>
                                            <span className="truncate">{l.title || `Aula ${li + 1}`}</span>
                                            {Number(l.duration) > 0 && (
                                                <span className="ml-auto shrink-0 text-white/20">{l.duration}min</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Submit error */}
            {submitError && (
                <div className="flex items-center gap-3 p-4 bg-red-400/5 border border-red-400/20 rounded-xl">
                    <span className="text-red-400 text-sm">✕</span>
                    <p className="text-sm text-red-400/80">{submitError}</p>
                </div>
            )}

            {/* Submit indicator */}
            {isSubmitting && (
                <div className="flex items-center gap-3 py-3 justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                    <p className="text-sm text-white/50">Criando curso...</p>
                </div>
            )}
        </div>
    );
}
