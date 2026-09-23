import heroIllustration from "@/assets/hero-illustration.png";

export function HeroIllustration() {
  return (
    <img
      src={heroIllustration}
      alt=""
      aria-hidden
      className="h-auto w-full max-w-[420px] bg-transparent lg:max-w-[880px]"
    />
  );
}
