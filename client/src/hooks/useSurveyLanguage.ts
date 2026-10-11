import { packFor, readLanguage, writeLanguage } from "@/locales";
import type { SurveyLanguage } from "@/types/survey";
import { useEffect, useState } from "react";

export function useSurveyLanguage(locked?: SurveyLanguage) {
  const [language, setLanguage] = useState<SurveyLanguage>(() => {
    if (locked) {
      writeLanguage(locked);
      return locked;
    }
    return readLanguage() ?? "en";
  });

  useEffect(() => {
    if (!locked) return;
    writeLanguage(locked);
    setLanguage(locked);
  }, [locked]);

  useEffect(() => {
    const previousLang = document.documentElement.lang;
    const previousDir = document.documentElement.dir;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    return () => {
      document.documentElement.lang = previousLang || "en";
      document.documentElement.dir = previousDir || "ltr";
    };
  }, [language]);

  function selectLanguage(next: SurveyLanguage) {
    setLanguage(next);
    writeLanguage(next);
  }

  return { language, copy: packFor(language), selectLanguage };
}
