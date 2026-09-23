import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/services/api";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export function LandingPage() {
  useEffect(() => {
    void trackEvent("landing_view");
  }, []);

  return (
    <div className="survey-shell">
      <div className="relative mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-5 py-10 md:px-10">
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#A993EB]">
              How to find help
            </p>
            <h1 className="text-[36px] font-extrabold leading-[1.08] text-white md:text-[54px]">
              Help us understand
              <br />
              how people find
              <br />
              <span className="text-[#DF3F8F]">everyday help</span>
            </h1>
            <p className="mt-8 text-lg font-semibold text-white">5 quick questions. About 1 minute.</p>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#D9D2EC]">
              We are researching how people find help for everyday tasks and what makes the experience easier, safer and
              more useful.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#A993EB]">
              <span className="rounded-full border border-white/10 px-3 py-1">No account required</span>
              <span className="rounded-full border border-white/10 px-3 py-1">No personal information</span>
            </div>
            <Button
              asChild
              className="btn-primary btn-cta mt-10 h-12 min-h-12 min-w-56 !rounded-full px-12 text-base font-semibold text-white"
            >
              <Link to="/survey">Start</Link>
            </Button>
          </div>
          <div className="flex justify-center lg:mt-16 lg:justify-end">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </div>
  );
}
