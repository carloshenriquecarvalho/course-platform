"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Clock, Play, FileText, Hash } from "lucide-react";
import { ModuleData } from "./StepModules";

export interface LessonData {
    tempId: string;
    moduleTempId: string;
    title: string;
    description: string;
    videoPath: string;
    duration: number | "";   // minutes, empty string while user is typing
    order: number;
}

interface StepLessonsProps {
    modules: ModuleData[];
    lessons: LessonData[];
    onAddLesson: (moduleTempId: string) => void;
    onRemoveLesson: (tempId: string) => void;
    onUpdateLesson: (tempId: string, field: Partial<LessonData>) => void;
    errors: Record<string, Partial<Record<keyof LessonData, string>>>;
}

function LessonRow({
    lesson,
    index,
    onRemove,
    onUpdate,
    fieldErrors,
}: {
    lesson: LessonData;
    index: number;
    onRemove: () => void;
    onUpdate: (field: Partial<LessonData>) => void;
    fieldErrors: Partial<Record<keyof LessonData, string>>;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="border border-white/8 rounded-xl overflow-hidden bg-white/3 transition-all duration-200 hover:border-white/12">
            {/* Lesson header row */}
            <div className="flex items-center gap-3 px-4 py-3">
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="shrink-0 w-5 h-5 text-white/30 hover:text-white/70 transition-colors"
                >
                    {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Order badge */}
                <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-heading font-bold text-white/30 bg-white/5 shrink-0">
                    {index + 1}
                </span>

                {/* Title inline input */}
                <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder={`Aula ${index + 1} — ex: Introdução ao Peeling`}
                    onClick={() => !expanded && setExpanded(true)}
                    className={`flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none border-b transition-colors duration-200 ${
                        fieldErrors.title
                            ? "border-red-400/40"
                            : "border-transparent focus:border-amber-400/30"
                    }`}
                />

                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    <Clock className={`w-3 h-3 ${fieldErrors.duration ? "text-red-400" : "text-white/20"}`} />
                    <input
                        type="number"
                        min={1}
                        value={lesson.duration}
                        onChange={(e) =>
                            onUpdate({ duration: e.target.value === "" ? "" : parseInt(e.target.value) })
                        }
                        placeholder="0"
                        className={`w-14 bg-white/5 border rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none transition-colors ${
                            fieldErrors.duration ? "border-red-400/40 focus:border-red-400/60" : "border-white/8 focus:border-amber-400/30"
                        }`}
                        title={fieldErrors.duration || "Duração em minutos"}
                    />
                    <span className="text-[10px] text-white/25">min</span>
                </div>

                {/* Remove */}
                <button
                    type="button"
                    onClick={onRemove}
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white/15 hover:text-red-400/60 hover:bg-red-400/8 transition-all duration-200"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>

            {/* Expanded detail fields */}
            {expanded && (
                <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-4 bg-white/2 animate-fadeIn">
                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs text-white/40">
                            <FileText className="w-3 h-3" />
                            Descrição
                            <span className="text-amber-400/60">*</span>
                        </label>
                        <textarea
                            value={lesson.description}
                            onChange={(e) => onUpdate({ description: e.target.value })}
                            placeholder="Descreva o conteúdo desta aula (mínimo 20 caracteres)..."
                            rows={2}
                            className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/15 focus:outline-none transition-all resize-none ${
                                fieldErrors.description ? "border-red-400/30" : "border-white/8 focus:border-amber-400/30"
                            }`}
                        />
                        {fieldErrors.description && (
                            <p className="text-[11px] text-red-400/70">⚠ {fieldErrors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Video path */}
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs text-white/40">
                                <Play className="w-3 h-3" />
                                Caminho do vídeo
                                <span className="text-[10px] bg-amber-400/10 text-amber-400/60 border border-amber-400/20 rounded px-1 ml-1">
                                    TODO: upload
                                </span>
                            </label>
                            <input
                                type="text"
                                value={lesson.videoPath}
                                onChange={(e) => onUpdate({ videoPath: e.target.value })}
                                placeholder="/videos/aula-01.mp4"
                                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-white/15 focus:outline-none focus:border-amber-400/30 transition-colors"
                            />
                        </div>

                        {/* Order */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs text-white/40">
                                <Hash className="w-3 h-3" />
                                Ordem
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={lesson.order}
                                onChange={(e) => onUpdate({ order: parseInt(e.target.value) || 1 })}
                                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-400/30 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Mobile duration */}
                    <div className="sm:hidden space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            Duração (minutos)
                            <span className="text-amber-400/60">*</span>
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={lesson.duration}
                            onChange={(e) =>
                                onUpdate({ duration: e.target.value === "" ? "" : parseInt(e.target.value) })
                            }
                            className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-xs text-white text-center focus:outline-none transition-colors ${
                                fieldErrors.duration ? "border-red-400/40" : "border-white/8 focus:border-amber-400/30"
                            }`}
                        />
                        {fieldErrors.duration && (
                            <p className="text-[11px] text-red-400/70">⚠ {fieldErrors.duration}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function StepLessons({
    modules,
    lessons,
    onAddLesson,
    onRemoveLesson,
    onUpdateLesson,
    errors,
}: StepLessonsProps) {
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
        Object.fromEntries(modules.map((m) => [m.tempId, true]))
    );

    const toggleModule = (tempId: string) => {
        setExpandedModules((prev) => ({ ...prev, [tempId]: !prev[tempId] }));
    };

    const lessonsForModule = (moduleTempId: string) =>
        lessons.filter((l) => l.moduleTempId === moduleTempId);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1.5">
                <h2 className="font-heading text-xl font-semibold text-white">Aulas por Módulo</h2>
                <p className="text-sm text-white/40">
                    Adicione aulas a cada módulo. Você pode expandir os campos para preencher os detalhes.
                </p>
            </div>

            {modules.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-12 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-sm text-white/30">Nenhum módulo encontrado</p>
                    <p className="text-xs text-white/20">Volte ao passo anterior e adicione módulos primeiro</p>
                </div>
            )}

            <div className="space-y-4">
                {modules.map((mod, modIndex) => {
                    const modLessons = lessonsForModule(mod.tempId);
                    const isOpen = expandedModules[mod.tempId] ?? true;

                    return (
                        <div
                            key={mod.tempId}
                            className="border border-white/8 rounded-2xl overflow-hidden"
                        >
                            {/* Module header */}
                            <button
                                type="button"
                                onClick={() => toggleModule(mod.tempId)}
                                className="flex items-center gap-3 w-full px-5 py-4 bg-white/3 hover:bg-white/5 transition-colors text-left"
                            >
                                <span className="w-6 h-6 rounded-lg gold-gradient flex items-center justify-center text-xs font-heading font-bold text-black shrink-0">
                                    {modIndex + 1}
                                </span>
                                <span className="font-heading text-sm font-semibold text-white/80 flex-1 truncate">
                                    {mod.title || `Módulo ${modIndex + 1}`}
                                </span>
                                <span className="text-xs text-white/30 shrink-0">
                                    {modLessons.length} aula{modLessons.length !== 1 ? "s" : ""}
                                </span>
                                {isOpen ? (
                                    <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                                )}
                            </button>

                            {/* Lessons list */}
                            {isOpen && (
                                <div className="p-4 space-y-2 border-t border-white/5 bg-black/10">
                                    {modLessons.map((lesson, lessonIndex) => (
                                        <LessonRow
                                            key={lesson.tempId}
                                            lesson={lesson}
                                            index={lessonIndex}
                                            onRemove={() => onRemoveLesson(lesson.tempId)}
                                            onUpdate={(field) => onUpdateLesson(lesson.tempId, field)}
                                            fieldErrors={errors[lesson.tempId] ?? {}}
                                        />
                                    ))}

                                    {/* Add lesson */}
                                    <button
                                        type="button"
                                        onClick={() => onAddLesson(mod.tempId)}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 border border-dashed border-white/8 rounded-xl text-xs text-white/25 hover:text-white/50 hover:border-white/18 hover:bg-white/3 transition-all duration-200"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Adicionar aula neste módulo
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {lessons.length > 0 && (
                <p className="text-xs text-white/25 text-center">
                    {lessons.length} aula{lessons.length > 1 ? "s" : ""} no total
                </p>
            )}
        </div>
    );
}
