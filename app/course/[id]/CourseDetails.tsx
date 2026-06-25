'use client'
import Image from "next/image";
import useFetchData from "@/app/hooks/useFetchData";
import { Course } from "@/app/types";
import { SquarePlay, Clock, BookOpen, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import EmptyState from "@/app/components/ui/EmptyState";

interface Props {
    id: string;
}

export default function CourseDetails({ id }: Props) {
    const router = useRouter();
    const {
        data: course,
        loading,
        error,
    } = useFetchData<Course>({
        url: `/api/courses/${id}`,
    });

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <LoadingSpinner size="lg" text="Carregando curso..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <EmptyState title="Erro ao carregar" description={error} />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <EmptyState title="Curso não encontrado" description="O curso que você está procurando não existe ou foi removido." />
            </div>
        );
    }

    console.log(course)


    const totalLessons = course.modules.reduce(
        (acc, mod) => acc + mod.lessons.length,
        0
    );
    const totalDurationMin = course.modules.reduce(
        (acc, mod) =>
            acc + mod.lessons.reduce((a, l) => a + (l.duration ?? 0), 0),
        0
    );
    const totalHours = Math.floor(totalDurationMin / 60);
    const totalMins = totalDurationMin % 60;

    return (
        <div className="min-h-screen bg-background">
            {/* Back button */}
            <div className="max-w-5xl mx-auto px-6 pt-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors duration-200 mb-6 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Voltar
                </button>
            </div>

            {/* Hero banner */}
            <div className="relative w-full aspect-[21/7] overflow-hidden bg-zinc-900">
                <Image
                    src="/mock-course.png"
                    fill
                    sizes="100vw"
                    alt={`Banner do curso ${course.title}`}
                    className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left — course info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & description */}
                        <div className="animate-slideUp">
                            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                                {course.title}
                            </h1>
                            <p className="text-white/55 text-base leading-relaxed">
                                {course.description}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-5 text-sm animate-fadeIn">
                            <div className="flex items-center gap-2 text-white/50">
                                <BookOpen className="w-4 h-4 text-amber-400/70" />
                                <span>
                                    <strong className="text-white/80">{totalLessons}</strong>{" "}
                                    {totalLessons === 1 ? "aula" : "aulas"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-white/50">
                                <CheckCircle2 className="w-4 h-4 text-amber-400/70" />
                                <span>
                                    <strong className="text-white/80">{course.modules.length}</strong>{" "}
                                    {course.modules.length === 1 ? "módulo" : "módulos"}
                                </span>
                            </div>
                            {totalDurationMin > 0 && (
                                <div className="flex items-center gap-2 text-white/50">
                                    <Clock className="w-4 h-4 text-amber-400/70" />
                                    <span>
                                        <strong className="text-white/80">
                                            {totalHours > 0 ? `${totalHours}h ` : ""}
                                            {totalMins > 0 ? `${totalMins}min` : ""}
                                        </strong>
                                        {" "}de conteúdo
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Module accordion */}
                        <div className="animate-slideUp">
                            <h2 className="font-heading text-lg font-semibold text-white mb-3">
                                Conteúdo do Curso
                            </h2>
                            <div className="rounded-2xl border border-white/8 bg-card overflow-hidden">
                                <Accordion type="multiple" className="w-full">
                                    {course.modules.map((module, moduleIdx) => (
                                        <AccordionItem
                                            key={module.id}
                                            value={module.id}
                                            className="border-b border-white/6 last:border-0"
                                        >
                                            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/3 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                                                        <span className="text-amber-400 text-xs font-heading font-bold">
                                                            {moduleIdx + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-heading text-sm font-semibold text-white">
                                                            {module.title}
                                                        </p>
                                                        <p className="text-[11px] text-white/35 mt-0.5">
                                                            {module.lessons.length} {module.lessons.length === 1 ? "aula" : "aulas"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent className="px-5 pb-3">
                                                <ul className="space-y-1">
                                                    {module.lessons.map((lesson, lessonIdx) => (
                                                        <li key={lesson.id}>
                                                            <button
                                                                onClick={() =>
                                                                    router.push(
                                                                        `/course/${course.id}/lesson/${lesson.id}`
                                                                    )
                                                                }
                                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left hover:bg-amber-400/6 group transition-all duration-150"
                                                            >
                                                                <SquarePlay className="w-4 h-4 text-white/25 group-hover:text-amber-400/70 shrink-0 transition-colors" />
                                                                <span className="text-sm text-white/55 group-hover:text-white/90 transition-colors flex-1">
                                                                    <span className="text-white/25 text-xs mr-2">
                                                                        {lessonIdx + 1}.
                                                                    </span>
                                                                    {lesson.title}
                                                                </span>
                                                                {lesson.duration && (
                                                                    <span className="text-xs text-white/25 shrink-0">
                                                                        {lesson.duration}min
                                                                    </span>
                                                                )}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>

                    {/* Right — sticky action card */}
                    <div className="lg:col-span-1">
                        <div
                            className="sticky top-6 rounded-2xl border border-white/8 bg-card p-5 space-y-4 animate-slideUp"
                            style={{ boxShadow: "0 16px 48px oklch(0 0 0 / 0.4)" }}
                        >
                            <div className="space-y-1">
                                <p className="text-xs text-white/35 uppercase tracking-wider font-medium">Instrutor</p>
                                <p className="text-sm text-white/80 font-medium">{course.instructor.name ?? "—"}</p>
                            </div>
                            <div className="h-px bg-white/6" />
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="rounded-xl bg-white/4 p-3">
                                    <p className="font-heading text-xl font-bold text-amber-400">{totalLessons}</p>
                                    <p className="text-[10px] text-white/35 mt-0.5 uppercase tracking-wide">Aulas</p>
                                </div>
                                <div className="rounded-xl bg-white/4 p-3">
                                    <p className="font-heading text-xl font-bold text-amber-400">{course.modules.length}</p>
                                    <p className="text-[10px] text-white/35 mt-0.5 uppercase tracking-wide">Módulos</p>
                                </div>
                            </div>
                            {course.modules.length > 0 && course.modules[0].lessons.length > 0 && (
                                <button
                                    onClick={() =>
                                        router.push(
                                            `/course/${course.id}/lesson/${course.modules[0].lessons[0].id}`
                                        )
                                    }
                                    className="w-full gold-gradient text-black font-heading font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                                    style={{ boxShadow: "0 4px 20px oklch(0.72 0.15 85 / 0.3)" }}
                                >
                                    <SquarePlay className="w-4 h-4" />
                                    Assistir Curso
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}