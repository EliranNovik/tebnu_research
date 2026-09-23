import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { SurveyLanguage } from "@/types/survey";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type InfoPageProps = {
  title: string;
  backLabel: string;
  actionLabel: string;
  illustration: string;
  footerPrivacy: string;
  footerPurpose: string;
  footerContact: string;
  language: SurveyLanguage;
  onLanguage: (language: SurveyLanguage) => void;
  children: ReactNode;
};

const contactEmail = "mailto:info@tebnu.com";

export function InfoPage({
  title,
  backLabel,
  actionLabel,
  illustration,
  footerPrivacy,
  footerPurpose,
  footerContact,
  language,
  onLanguage,
  children,
}: InfoPageProps) {
  return (
    <div className="survey-shell" lang={language} dir={language === "he" ? "rtl" : "ltr"}>
      <LanguageSwitcher value={language} onChange={onLanguage} />
      <Link
        to="/"
        className="absolute top-5 left-5 z-30 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 text-sm font-semibold text-white hover:bg-white/10 md:top-6 md:left-10"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {backLabel}
      </Link>
      <img
        src={illustration}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 z-0 hidden w-[min(38vw,440px)] select-none lg:block"
      />
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-2xl flex-col px-5 pt-24 pb-24 md:px-10">
        <h1 className="text-4xl font-extrabold text-white">{title}</h1>
        <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[#D9D2EC]">{children}</div>
        <Link
          to="/survey"
          className="btn-primary btn-cta mt-10 inline-flex h-14 min-h-14 w-fit min-w-64 items-center justify-center gap-2.5 self-start !rounded-full px-14 text-lg font-semibold text-white"
        >
          {actionLabel}
          <span className="inline-flex rtl:-scale-x-100">
            <ArrowRight className="cta-arrow size-5" />
          </span>
        </Link>
      </div>
      <nav className="absolute bottom-5 left-5 z-20 flex items-center gap-3 text-sm text-[#C9BDE8] md:bottom-6 md:left-10">
        <Link to="/privacy" className="hover:text-white">
          {footerPrivacy}
        </Link>
        <span aria-hidden="true">|</span>
        <Link to="/research-purpose" className="hover:text-white">
          {footerPurpose}
        </Link>
        <span aria-hidden="true">|</span>
        <a
          href={contactEmail}
          className="hover:text-white"
          onClick={(event) => {
            event.preventDefault();
            window.location.href = contactEmail;
          }}
        >
          {footerContact}
        </a>
      </nav>
    </div>
  );
}
