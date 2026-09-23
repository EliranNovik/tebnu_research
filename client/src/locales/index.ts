import type { SurveyLanguage } from "@shared/types";
import { en, type LocalePack } from "./en";
import { fr } from "./fr";
import { he } from "./he";
import { ru } from "./ru";

export const packs: Record<SurveyLanguage, LocalePack> = { en, ru, fr, he };

export const languageChoices: { id: SurveyLanguage; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "fr", label: "Français" },
  { id: "he", label: "עברית" },
];

const STORAGE_KEY = "tebnu_survey_language";

export function readLanguage(): SurveyLanguage | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (value === "en" || value === "ru" || value === "fr" || value === "he") return value;
  } catch {
    return null;
  }
  return null;
}

export function writeLanguage(language: SurveyLanguage) {
  sessionStorage.setItem(STORAGE_KEY, language);
}

export function packFor(language: SurveyLanguage | null): LocalePack {
  return packs[language ?? "en"];
}

export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

export function optionText(pack: LocalePack, questionId: keyof LocalePack["questions"], value: string) {
  const options = pack.questions[questionId].options as Record<string, { label: string; description?: string }>;
  return options[value];
}
