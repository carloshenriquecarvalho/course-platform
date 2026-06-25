"use client";

import { BookText, FileText } from "lucide-react";

interface CourseFormData {
    title: string;
    description: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    instructorId: string;
}

interface StepCourseInfoProps {
    data: CourseFormData;
    onChange: (data: Partial<CourseFormData>) => void;
    errors: Partial<Record<keyof CourseFormData, string>>;
    isAdmin: boolean;
    users?: any[];
    loadingUsers?: boolean;
    usersError?: string | null;
}

const STATUS_OPTIONS = [
    { value: "DRAFT", label: "Rascunho", description: "Visível apenas para você", color: "text-white/50" },
    { value: "PUBLISHED", label: "Publicado", description: "Visível para todos os alunos", color: "text-emerald-400" },
    { value: "ARCHIVED", label: "Arquivado", description: "Oculto da plataforma", color: "text-red-400/70" },
] as const;

export default function StepCourseInfo({ data, onChange, errors, isAdmin, users, loadingUsers, usersError }: StepCourseInfoProps) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1.5">
                <h2 className="font-heading text-xl font-semibold text-white">Informações do Curso</h2>
                <p className="text-sm text-white/40">Preencha os dados principais do curso que será criado.</p>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <label htmlFor="course-title" className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <BookText className="w-3.5 h-3.5 text-amber-400/70" />
                    Título do Curso
                    <span className="text-amber-400/70">*</span>
                </label>
                <input
                    id="course-title"
                    type="text"
                    value={data.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="Ex: Fundamentos de Biomedicina Estética"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-200 ${
                        errors.title
                            ? "border-red-400/40 focus:border-red-400/60"
                            : "border-white/8 focus:border-amber-400/40 focus:bg-white/7"
                    }`}
                />
                {errors.title && (
                    <p className="text-xs text-red-400/80 flex items-center gap-1">
                        <span>⚠</span> {errors.title}
                    </p>
                )}
                <p className="text-xs text-white/25">{data.title.length}/100 caracteres (mínimo 5)</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label htmlFor="course-description" className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <FileText className="w-3.5 h-3.5 text-amber-400/70" />
                    Descrição
                    <span className="text-amber-400/70">*</span>
                </label>
                <textarea
                    id="course-description"
                    value={data.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Descreva o que o aluno aprenderá neste curso, objetivos, pré-requisitos..."
                    rows={4}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-200 resize-none scrollbar-thin ${
                        errors.description
                            ? "border-red-400/40 focus:border-red-400/60"
                            : "border-white/8 focus:border-amber-400/40 focus:bg-white/7"
                    }`}
                />
                {errors.description && (
                    <p className="text-xs text-red-400/80 flex items-center gap-1">
                        <span>⚠</span> {errors.description}
                    </p>
                )}
                <p className="text-xs text-white/25">{data.description.length} caracteres (mínimo 20)</p>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Status inicial</label>
                <div className="grid grid-cols-3 gap-3">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange({ status: opt.value })}
                            className={`relative flex flex-col items-start gap-1 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                                data.status === opt.value
                                    ? "border-amber-400/40 bg-amber-400/8"
                                    : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
                            }`}
                        >
                            {data.status === opt.value && (
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
                            )}
                            <span className={`text-sm font-medium font-heading ${data.status === opt.value ? "text-amber-400" : "text-white/70"}`}>
                                {opt.label}
                            </span>
                            <span className={`text-[10px] ${data.status === opt.value ? opt.color : "text-white/25"}`}>
                                {opt.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* InstructorId — Only for admins */}
            {isAdmin && (
                <div className="space-y-2">
                    <label htmlFor="instructor-id" className="flex items-center gap-2 text-sm font-medium text-white/70">
                        Instrutor Responsável
                        <span className="text-amber-400/70">*</span>
                    </label>
                    <select
                        id="instructor-id"
                        value={data.instructorId}
                        onChange={(e) => onChange({ instructorId: e.target.value })}
                        disabled={loadingUsers}
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-200 appearance-none ${
                            errors.instructorId
                                ? "border-red-400/40 focus:border-red-400/60"
                                : "border-white/8 focus:border-amber-400/40 focus:bg-white/7"
                        }`}
                    >
                        <option value="" className="bg-background text-white/50">Selecione um instrutor</option>
                        {users?.map((u: any) => (
                            <option key={u.id} value={u.id} className="bg-background">
                                {u.name}
                            </option>
                        ))}
                    </select>
                    {loadingUsers && <p className="text-xs text-amber-400/70">Carregando usuários...</p>}
                    {usersError && <p className="text-xs text-red-400/80">Erro ao carregar usuários: {usersError}</p>}
                    {errors.instructorId && (
                        <p className="text-xs text-red-400/80 flex items-center gap-1">
                            <span>⚠</span> {errors.instructorId}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
