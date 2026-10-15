import tebnuIcon from "@/assets/tebnu-icon.png";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { SuccessIllustration } from "@/components/illustrations/SuccessIllustration";
import { Button } from "@/components/ui/button";
import { useShareSurvey } from "@/hooks/useShareSurvey";
import { packFor, readLanguage } from "@/locales";
import { ExternalLink, Mail, Share2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const contactEmail = "mailto:info@tebnu.com";
const tebnuSite = "https://www.tebnu.com";
const tebnuRegister = "https://www.tebnu.com/onboarding";

export function ThankYouPage() {
  const language = readLanguage() ?? "en";
  const copy = packFor(language);
  const { share, copied } = useShareSurvey(copy.shareText, `/${language}`);

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

  return (
    <div className="survey-shell" lang={language} dir={language === "he" ? "rtl" : "ltr"}>
      <div className="relative mx-auto flex min-h-svh w-full max-w-none flex-col items-center justify-center px-0 py-6 sm:max-w-xl sm:px-6 sm:py-10 lg:max-w-7xl lg:px-10">
        <div className="grid w-full min-w-0 items-center lg:grid-cols-2 lg:gap-10">
          <div className="survey-panel thank-you-stage mx-auto flex w-full min-w-0 max-w-none flex-col !rounded-none px-5 py-10 text-center sm:max-w-xl sm:!rounded-3xl sm:px-6 sm:py-12 lg:mx-0">
          <div className="thank-you-intro flex flex-1 flex-col items-center justify-center">
          <SuccessIllustration />
          <h1 className="mt-6 text-4xl font-extrabold text-white">{copy.thankYouTitle}</h1>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[#D9D2EC]">{copy.thankYouBody}</p>
          </div>
          <div className="thank-you-reveal">
          <div className="min-h-0 overflow-hidden">
          <div className="tebnu-pop mt-8 rounded-2xl bg-white/[0.08] px-5 py-5 text-start">
            <div className="flex items-center gap-3">
              <img src={tebnuIcon} alt="" className="size-14 shrink-0 rounded-[18px]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9BDE8]">{copy.tebnu.eyebrow}</p>
                <h2 className="mt-1 text-2xl font-extrabold text-white">{copy.tebnu.title}</h2>
              </div>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[#D9D2EC]">{copy.tebnu.body}</p>
            <p className="mt-6 text-[15px] leading-relaxed text-white">{copy.tebnu.beta}</p>
            <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row">
              <Button asChild className="btn-primary h-12 w-full min-w-0 flex-1 shrink rounded-[14px] px-5 font-semibold whitespace-normal text-white">
                <a href={tebnuRegister} target="_blank" rel="noopener noreferrer">
                  {copy.tebnu.register}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button asChild className="btn-secondary h-12 w-full min-w-0 flex-1 shrink rounded-[14px] px-5 font-semibold whitespace-normal text-white">
                <a href={tebnuSite} target="_blank" rel="noopener noreferrer">
                  {copy.tebnu.checkOut}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          </div>
          </div>
          </div>
          <div dir="ltr" className="mt-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => void share()}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D9D2EC]"
              >
                <Share2 className="size-4" />
                {copied ? copy.linkCopied : copy.share}
              </button>
              <a
                href={contactEmail}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D9D2EC]"
                onClick={(event) => {
                  event.preventDefault();
                  window.location.href = contactEmail;
                }}
              >
                <Mail className="size-4" />
                {copy.contact}
              </a>
            </div>
            <Button asChild className="btn-primary h-12 min-w-28 shrink-0 rounded-[14px] px-6 font-semibold text-white">
              <Link to="/">{copy.done}</Link>
            </Button>
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
