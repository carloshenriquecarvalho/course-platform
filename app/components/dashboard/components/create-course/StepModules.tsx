"use client";

import { Plus, Trash2, GripVertical, Layers } from "lucide-react";

export interface ModuleData {
    tempId: string;  // client-side ID before API creation
    title: string;
    order: number;
}

interface StepModulesProps {
    modules: ModuleData[];
    onAdd: () => void;
    onRemove: (tempId: string) => void;
    onUpdate: (tempId: string, title: string) => void;
    errors: Record<string, string>;
}

export default function StepModules({ modules, onAdd, onRemove, onUpdate, errors }: StepModulesProps) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1.5">
                <h2 className="font-heading text-xl font-semibold text-white">Módulos do Curso</h2>
                <p className="text-sm text-white/40">
                    Organize o conteúdo em módulos. A ordem será definida pela sequência abaixo.
                </p>
            </div>

            {/* Module list */}
            <div className="space-y-3">
                {modules.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 border border-dashed border-white/10 rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-white/25" />
                        </div>
                        <p className="text-sm text-white/30">Nenhum módulo adicionado ainda</p>
                        <button
                            type="button"
                            onClick={onAdd}
                            className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                        >
                            + Adicionar primeiro módulo
                        </button>
                    </div>
                )}

                {modules.map((mod, index) => (
                    <div
                        key={mod.tempId}
                        className="group flex items-center gap-3 p-4 bg-white/3 border border-white/8 rounded-2xl hover:border-white/15 transition-all duration-200"
                    >
                        {/* Order handle */}
                        <div className="flex items-center gap-2 shrink-0">
                            <GripVertical className="w-4 h-4 text-white/15 cursor-grab" />
                            <span className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xs font-heading font-semibold text-amber-400/80">
                                {index + 1}
                            </span>
                        </div>

                        {/* Title input */}
                        <div className="flex-1 min-w-0">
                            <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => onUpdate(mod.tempId, e.target.value)}
                                placeholder={`Módulo ${index + 1} — ex: Introdução ao Protocolo`}
                                className={`w-full bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none border-b pb-0.5 transition-colors duration-200 ${
                                    errors[mod.tempId]
                                        ? "border-red-400/40"
                                        : "border-transparent focus:border-amber-400/40"
                                }`}
                            />
                            {errors[mod.tempId] && (
                                <p className="text-xs text-red-400/70 mt-1">⚠ {errors[mod.tempId]}</p>
                            )}
                        </div>

                        {/* Remove */}
                        <button
                            type="button"
                            onClick={() => onRemove(mod.tempId)}
                            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400/70 hover:bg-red-400/8 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add module button */}
            {modules.length > 0 && (
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-2 w-full px-4 py-3 border border-dashed border-white/10 rounded-2xl text-sm text-white/35 hover:text-white/60 hover:border-white/20 hover:bg-white/3 transition-all duration-200"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar módulo
                </button>
            )}

            {modules.length > 0 && (
                <p className="text-xs text-white/25 text-center">
                    {modules.length} módulo{modules.length > 1 ? "s" : ""} • A ordem será salva conforme listada
                </p>
            )}
        </div>
    );
}
