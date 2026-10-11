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

  const copy = packFor(language);

  useEffect(() => {
    const previousLang = document.documentElement.lang;
    const previousDir = document.documentElement.dir;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.title = `${copy.landing.headlineLead} ${copy.landing.headlineMiddle} ${copy.landing.headlineAccent}`;
    return () => {
      document.documentElement.lang = previousLang || "en";
      document.documentElement.dir = previousDir || "ltr";
    };
  }, [language, copy]);

  function selectLanguage(next: SurveyLanguage) {
    setLanguage(next);
    writeLanguage(next);
  }

  return { language, copy, selectLanguage };
}
