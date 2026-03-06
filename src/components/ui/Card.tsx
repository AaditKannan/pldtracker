import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const bg = variant === "elevated" ? "bg-[var(--bg-elevated)]" : "bg-[var(--bg-surface)]";
  return (
    <div
      className={`${bg} border border-[var(--border-subtle)] rounded-lg p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
