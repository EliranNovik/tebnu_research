import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { SuccessIllustration } from "@/components/illustrations/SuccessIllustration";
import { Button } from "@/components/ui/button";
import { packFor, readLanguage } from "@/locales";
import { Mail, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const contactEmail = "mailto:info@tebnu.com";

export function ThankYouPage() {
  const [copied, setCopied] = useState(false);
  const language = readLanguage() ?? "en";
  const copy = packFor(language);

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

  async function shareSurvey() {
    const url = window.location.origin;
    const payload = { title: "Tebnu", text: copy.shareText, url };

    if (typeof navigator.share === "function" && (navigator.canShare?.(payload) ?? true)) {
      try {
        await navigator.share(payload);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="survey-shell" lang={language} dir={language === "he" ? "rtl" : "ltr"}>
      <div className="relative mx-auto flex min-h-svh w-full max-w-xl flex-col items-center justify-center px-6 py-10 lg:max-w-7xl lg:px-10">
        <div className="grid w-full items-center lg:grid-cols-2 lg:gap-10">
          <div className="survey-panel mx-auto w-full max-w-xl px-6 py-12 text-center lg:mx-0">
          <SuccessIllustration />
          <h1 className="mt-6 text-4xl font-extrabold text-white">{copy.thankYouTitle}</h1>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[#D9D2EC]">{copy.thankYouBody}</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                onClick={() => void shareSurvey()}
                className="btn-secondary h-12 min-w-36 rounded-[14px] px-6 font-semibold text-white"
              >
                <Share2 className="size-4" />
                {copied ? copy.linkCopied : copy.share}
              </Button>
              <Button asChild className="btn-primary h-12 min-w-36 rounded-[14px] px-8 font-semibold text-white">
                <Link to="/">{copy.done}</Link>
              </Button>
            </div>
            <a
              href={contactEmail}
              className="btn-secondary inline-flex h-12 min-w-40 items-center justify-center gap-2 rounded-[14px] px-6 text-sm font-semibold text-white"
              onClick={(event) => {
                event.preventDefault();
                window.location.href = contactEmail;
              }}
            >
              <Mail className="size-4" />
              {copy.contact}
            </a>
          </div>
          </div>
          <div className="hidden justify-center lg:flex lg:justify-end">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </div>
  );
}
