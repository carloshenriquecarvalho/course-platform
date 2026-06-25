"use client";

import { BookOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "Nenhum conteúdo encontrado",
  description = "Não há itens para exibir aqui no momento.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
        {icon ?? <BookOpen className="w-7 h-7 text-amber-400/60" />}
      </div>
      <div className="text-center space-y-1 max-w-xs">
        <h3 className="font-heading text-base font-medium text-white/80">{title}</h3>
        <p className="text-sm text-white/35">{description}</p>
      </div>
    </div>
  );
}
