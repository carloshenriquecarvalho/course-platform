import { CourseCardProps } from "../../../types"
import Image from "next/image"
import Link from "next/link"
import { User, Calendar, ArrowRight } from "lucide-react"

export function CardImage({ id, title, description, instructor, createdAt, progress }: CourseCardProps) {
  const progressValue = progress ?? 0;
  const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:shadow-xl"
      style={{ "--hover-shadow": "0 16px 40px oklch(0 0 0 / 0.5)" } as React.CSSProperties}
    >
      {/* Banner */}
      <div className="relative aspect-video overflow-hidden bg-zinc-900 shrink-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Image
          src="/course-banner-mock.png"
          alt={`Capa do curso ${title}`}
          width={400}
          height={225}
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Status badge */}
        <div className="absolute top-3 right-3 z-20">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-amber-400/15 text-amber-400 border border-amber-400/25 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Publicado
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-white leading-snug line-clamp-2 group-hover:text-amber-400/90 transition-colors duration-200">
            {title}
          </h2>
          <p className="text-xs text-white/40 mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/35">Progresso</span>
            <span className={`font-medium ${progressValue === 100 ? "text-emerald-400" : "text-amber-400"}`}>
              {Math.round(progressValue)}%
            </span>
          </div>
          <div className="h-1 w-full bg-white/6 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                progressValue === 100 ? "bg-emerald-400" : "gold-gradient"
              }`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-white/30 border-t border-white/5 pt-3">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3" />
            <span>{instructor.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/course/${id}`}
          className="flex items-center justify-center gap-2 w-full gold-gradient text-black font-heading font-semibold text-sm py-2.5 rounded-xl mt-auto transition-all duration-200 hover:opacity-90"
          style={{ boxShadow: "0 4px 14px oklch(0.72 0.15 85 / 0.2)" }}
        >
          {progressValue > 0 ? "Continuar Curso" : "Acessar Curso"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
