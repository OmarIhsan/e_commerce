"use client";

import { useTheme } from "@/lib/theme";
import { useEcomI18n } from "@/lib/i18n";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useEcomI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-titanium-900 ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex h-9 w-9 items-center justify-center rounded-md border transition-all cursor-pointer ${
        isDark
          ? "border-white/10 bg-titanium-900 text-amber-400 hover:border-amber-400/50 hover:bg-titanium-850"
          : "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 shadow-xs"
      } ${className}`}
      title={isDark ? t.theme.light : t.theme.dark}
      aria-label={t.theme.toggle}
    >
      <Sun
        className={`h-4 w-4 transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100"
            : "-rotate-90 scale-0 absolute"
        }`}
      />
      <Moon
        className={`h-4 w-4 transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 absolute"
            : "rotate-0 scale-100"
        }`}
      />
    </button>
  );
}
