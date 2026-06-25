"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 animate-fadeIn">
      <div className={`relative ${sizeMap[size]}`}>
        {/* Outer ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-white/5`}
        />
        {/* Spinning arc */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin-slow`}
          style={{ filter: "drop-shadow(0 0 6px oklch(0.72 0.15 85 / 0.6))" }}
        />
      </div>
      {text && (
        <p className="text-sm text-white/40 tracking-wide">{text}</p>
      )}
    </div>
  );
}
