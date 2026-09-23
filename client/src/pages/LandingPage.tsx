import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ShareLinkButton } from "@/components/ShareLinkButton";
import { Button } from "@/components/ui/button";
import { useSurveyLanguage } from "@/hooks/useSurveyLanguage";
import { trackEvent } from "@/services/api";
import { ArrowRight, ChartColumn, Clock, Lock, Shield, User, Users } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const contactEmail = "mailto:info@tebnu.com";

const surveyFacts = [
  { icon: Clock, key: "questions" },
  { icon: User, key: "noAccount" },
  { icon: Shield, key: "anonymous" },
] as const;

const privacyPoints = [
  { icon: Lock, title: "privacyTitle", body: "privacyBody" },
  { icon: ChartColumn, title: "researchTitle", body: "researchBody" },
  { icon: Users, title: "lifeTitle", body: "lifeBody" },
] as const;

function ResearchMark() {
  return (
    <svg viewBox="0 0 28 28" className="size-7 shrink-0 text-[#A78BFA]" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.15" fill="none">
        <path d="M9 8.5 L14.5 15.5 L19 7" />
        <path d="M14.5 15.5 L22 13.5" />
        <path d="M14.5 15.5 L7.5 20.5" />
        <path d="M14.5 15.5 L17 23" />
      </g>
      <g fill="currentColor">
        <circle cx="9" cy="8.5" r="2.15" />
        <circle cx="19" cy="7" r="2.15" />
        <circle cx="22" cy="13.5" r="2" />
        <circle cx="14.5" cy="15.5" r="2.45" />
        <circle cx="7.5" cy="20.5" r="2.15" />
        <circle cx="17" cy="23" r="1.7" />
      </g>
    </svg>
  );
}

export function LandingPage() {
  const { language, copy, selectLanguage } = useSurveyLanguage();
  const text = copy.landing;

  useEffect(() => {
    void trackEvent("landing_view");
  }, []);

  return (
    <div className="survey-shell" lang={language} dir={language === "he" ? "rtl" : "ltr"}>
      <div dir="ltr" className="absolute top-5 right-5 z-30 flex items-center gap-2 md:top-6 md:right-10">
        <ShareLinkButton text={copy.shareText} label={copy.share} copiedLabel={copy.linkCopied} />
        <LanguageSwitcher value={language} onChange={selectLanguage} />
      </div>
      <div className="absolute top-5 left-5 z-30 flex items-center gap-2.5 md:top-6 md:left-10">
        <ResearchMark />
        <p className="text-[12px] font-semibold tracking-[0.16em] text-[#C9BDE8] uppercase">Everyday help research</p>
      </div>
      <div className="relative mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-5 pt-20 pb-20 md:px-10">
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#6E5C9A]">{text.eyebrow}</p>
            <h1 className="text-[36px] font-extrabold leading-[1.08] text-white md:text-[54px]">
              {text.headlineLead}
              <br />
              {text.headlineMiddle}
              <br />
              <span className="text-[#DF3F8F]">{text.headlineAccent}</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#D9D2EC]">{text.body}</p>
            <div className="mt-8">
            <div className="mb-8 flex flex-wrap items-center text-[15px] font-medium text-[#D4CBEE]">
              {surveyFacts.map((fact, index) => (
                <span key={fact.key} className={fact.key === "noAccount" ? "hidden items-center md:flex" : "flex items-center"}>
                  {index > 0 ? (
                    <span aria-hidden="true" className="mx-3 text-white/35">
                      |
                    </span>
                  ) : null}
                  <fact.icon className="me-2 size-[18px]" strokeWidth={1.75} />
                  {text[fact.key]}
                </span>
              ))}
            </div>
            <Button
              asChild
              className="btn-primary btn-cta h-14 min-h-14 w-fit min-w-64 gap-2.5 !rounded-full px-14 text-lg font-semibold text-white"
            >
              <Link to="/survey">
                {text.getStarted}
                <span className="inline-flex rtl:-scale-x-100">
                  <ArrowRight className="cta-arrow size-5" />
                </span>
              </Link>
            </Button>
            <p className="mt-2 text-[13px] text-[#6E5C9A]">{text.duration}</p>
            </div>
          </div>
          <div className="flex justify-center lg:mt-16 lg:origin-center lg:scale-[1.18] lg:justify-end">
            <HeroIllustration />
          </div>
          <div className="mt-8 md:border-y md:border-white/8 lg:col-span-2">
            <ul className="grid gap-3 md:grid-cols-3 md:gap-10 md:py-5">
              {privacyPoints.map((point) => (
                <li
                  key={point.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 md:rounded-none md:border-0 md:bg-transparent md:p-0"
                >
                  <point.icon className="size-7 shrink-0 text-[#B7A4EE]" strokeWidth={1.75} />
                  <div>
                    <p className="text-[15px] font-semibold leading-snug text-white">{text[point.title]}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-[#C9BDE8]">{text[point.body]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav className="absolute bottom-5 left-5 z-10 flex items-center gap-3 text-sm text-[#C9BDE8] md:bottom-6 md:left-10">
          <Link to="/privacy" className="hover:text-white">
            {text.footerPrivacy}
          </Link>
          <span aria-hidden="true">|</span>
          <Link to="/research-purpose" className="hover:text-white">
            {text.footerPurpose}
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
            {text.footerContact}
          </a>
        </nav>
      </div>
    </div>
  );
}
