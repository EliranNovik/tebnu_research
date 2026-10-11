import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";

const SITE = "https://help-research.vercel.app";

const previews = {
  en: {
    locale: "en_US",
    dir: "ltr",
    title: "Help us understand how people find everyday help",
    description:
      "We are researching how people find help for everyday tasks and what makes the experience easier, safer and more useful.",
  },
  ru: {
    locale: "ru_RU",
    dir: "ltr",
    title: "Помогите понять, как люди находят помощь в быту",
    description:
      "Мы изучаем, как люди находят помощь в повседневных делах и что делает этот опыт проще, безопаснее и полезнее.",
  },
  fr: {
    locale: "fr_FR",
    dir: "ltr",
    title: "Aidez-nous à comprendre comment les gens trouvent une aide du quotidien",
    description:
      "Nous étudions comment les gens trouvent de l'aide pour les tâches du quotidien, et ce qui rend cette expérience plus simple, plus sûre et plus utile.",
  },
  he: {
    locale: "he_IL",
    dir: "rtl",
    title: "עזרו לנו להבין איך אנשים מוצאים עזרה ביום־יום",
    description: "אנחנו חוקרים איך אנשים מוצאים עזרה למשימות יומיומיות, ומה הופך את זה לפשוט, בטוח ושימושי יותר.",
  },
} as const;

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// WhatsApp aligns the preview from the string direction. These marks keep the Hebrew title and description on the right.
const RTL_EMBED = "\u202B";
const RTL_END = "\u202C";

function previewCopy(value: string, dir: "ltr" | "rtl") {
  const text = dir === "rtl" ? `${RTL_EMBED}${value}${RTL_END}` : value;
  return escapeAttr(text);
}

export function applyLanguagePreview(html: string, code: keyof typeof previews) {
  const preview = previews[code];
  const title = previewCopy(preview.title, preview.dir);
  const description = previewCopy(preview.description, preview.dir);
  const image = `${SITE}/og-${code}.jpg`;

  return html
    .replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${code}" dir="${preview.dir}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${preview.locale}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${SITE}/${code}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
    .replaceAll(`${SITE}/og-en.jpg`, image);
}

export function languagePreviewPlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "language-preview",
    apply: "build",
    configResolved(resolved) {
      config = resolved;
    },
    closeBundle() {
      const indexPath = path.resolve(config.root, config.build.outDir, "index.html");
      const source = readFileSync(indexPath, "utf8");
      for (const code of Object.keys(previews) as (keyof typeof previews)[]) {
        writeFileSync(path.resolve(config.root, config.build.outDir, `${code}.html`), applyLanguagePreview(source, code));
      }
    },
  };
}
