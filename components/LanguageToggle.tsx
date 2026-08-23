"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18nDict";

interface LanguageToggleProps {
  currentLocale: Locale;
  className?: string;
}

const LANGUAGES: Array<{ code: Locale; label: string; nativeName: string; short: string }> = [
  { code: "en", label: "English", nativeName: "English", short: "EN" },
  { code: "ar", label: "Arabic", nativeName: "العربية", short: "عربي" },
  { code: "fr", label: "French", nativeName: "Français", short: "FR" },
];

export function LanguageToggle({ currentLocale, className = "" }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;

    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "ar" || segments[1] === "fr") {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join("/") || `/${newLocale}`;
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.push(`${newPath}${search}`);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
          isOpen ? "border-blue-500 bg-titanium-800 text-white" : className
        }`}
        title="Select Language / اختر اللغة / Choisir la langue"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5 text-blue-400 shrink-0" />
        <span className="font-medium">{activeLang.nativeName}</span>
        <ChevronDown className={`h-3 w-3 text-titanium-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-1.5 w-40 origin-top-right rounded-lg bg-titanium-900 border border-white/10 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-titanium-400 border-b border-white/5 tracking-wider">
            Language / اللغة
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLocale;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-start transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/20 text-blue-400 font-semibold"
                    : "text-titanium-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex flex-col">
                  <span>{lang.nativeName}</span>
                  <span className="text-[10px] text-titanium-400 font-normal">{lang.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
