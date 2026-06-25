"use client";

import { Check } from "lucide-react";

interface Step {
    id: number;
    label: string;
    description: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-0">
            {steps.map((step, index) => {
                const isDone = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                    <div key={step.id} className="flex items-center">
                        {/* Step circle + label */}
                        <div className="flex items-center gap-3">
                            <div
                                className={`relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                                    isDone
                                        ? "bg-amber-400 border-amber-400"
                                        : isActive
                                        ? "bg-amber-400/15 border-amber-400"
                                        : "bg-white/5 border-white/15"
                                }`}
                            >
                                {isDone ? (
                                    <Check className="w-4 h-4 text-black" strokeWidth={2.5} />
                                ) : (
                                    <span
                                        className={`text-sm font-semibold font-heading transition-colors ${
                                            isActive ? "text-amber-400" : "text-white/30"
                                        }`}
                                    >
                                        {step.id}
                                    </span>
                                )}
                                {/* Active pulse ring */}
                                {isActive && (
                                    <span className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping" />
                                )}
                            </div>

                            <div className="hidden sm:block">
                                <p
                                    className={`text-xs font-semibold font-heading transition-colors ${
                                        isActive
                                            ? "text-amber-400"
                                            : isDone
                                            ? "text-white/70"
                                            : "text-white/25"
                                    }`}
                                >
                                    {step.label}
                                </p>
                                <p
                                    className={`text-[10px] transition-colors ${
                                        isActive ? "text-white/50" : "text-white/20"
                                    }`}
                                >
                                    {step.description}
                                </p>
                            </div>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className="hidden sm:flex mx-4 flex-1 items-center">
                                <div
                                    className={`h-px w-16 transition-all duration-500 ${
                                        currentStep > step.id
                                            ? "bg-amber-400/60"
                                            : "bg-white/10"
                                    }`}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
