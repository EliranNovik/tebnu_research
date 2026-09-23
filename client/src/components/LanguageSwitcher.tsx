import { languageChoices } from "@/locales";
import { cn } from "@/lib/utils";
import type { SurveyLanguage } from "@/types/survey";
import { ChevronDown, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type LanguageSwitcherProps = {
  value: SurveyLanguage;
  onChange: (language: SurveyLanguage) => void;
};

export function LanguageSwitcher({ value, onChange }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = languageChoices.find((choice) => choice.id === value) ?? languageChoices[0];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/6 px-3 text-sm font-semibold text-white hover:bg-white/10 md:px-4"
      >
        <Languages className="hidden size-4 text-[#C4B4F5] md:block" />
        <span className="md:hidden">{current.id.toUpperCase()}</span>
        <span dir="auto" className="hidden md:inline">
          {current.label}
        </span>
        <ChevronDown className={cn("size-4 text-[#C4B4F5] transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute top-full right-0 mt-2 min-w-40 overflow-hidden rounded-2xl border border-white/12 bg-[#2B1468] py-1 shadow-xl"
        >
          {languageChoices.map((choice) => {
            const active = choice.id === value;
            return (
              <li key={choice.id}>
                <button
                  type="button"
                  role="option"
                  dir={choice.id === "he" ? "rtl" : "ltr"}
                  aria-selected={active}
                  onClick={() => {
                    onChange(choice.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full px-4 py-2.5 text-sm font-medium text-white hover:bg-white/8",
                    active && "bg-white/10 text-[#C4B4F5]",
                    choice.id === "he" ? "text-right" : "text-left",
                  )}
                >
                  {choice.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
