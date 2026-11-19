import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline"
    | "indigo"
    | "info";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs",
    secondary:
      "bg-slate-100 text-slate-700 border border-slate-200/90 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    success:
      "bg-emerald-50 text-emerald-800 border border-emerald-300/80 font-semibold dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    warning:
      "bg-amber-50 text-amber-900 border border-amber-300/80 font-semibold dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    danger:
      "bg-rose-50 text-rose-800 border border-rose-300/80 font-semibold dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    outline:
      "text-slate-700 border border-slate-300/90 bg-white shadow-2xs dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700",
    indigo:
      "bg-indigo-50 text-indigo-800 border border-indigo-300/80 font-semibold dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
    info:
      "bg-sky-50 text-sky-800 border border-sky-300/80 font-semibold dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

