"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

type Locale = "en" | "ar";

interface LanguageToggleProps {
  currentLocale: Locale;
  className?: string;
}

export function LanguageToggle({ currentLocale, className = "" }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next: Locale = currentLocale === "en" ? "ar" : "en";
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "ar") {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join("/") || `/${next}`);
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold border transition-colors ${className}`}
      title={currentLocale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{currentLocale === "ar" ? "English" : "عربي"}</span>
    </button>
  );
}
