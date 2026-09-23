import { useId } from "react";

type TebnuMarkProps = {
  className?: string;
};

export function TebnuMark({ className = "size-8" }: TebnuMarkProps) {
  const rawId = useId().replace(/:/g, "");
  const fill = `tebnu-fill-${rawId}`;
  const shine = `tebnu-shine-${rawId}`;

  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id={fill} x1="3" y1="2" x2="37" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B08CFF" />
          <stop offset="38%" stopColor="#6400FC" />
          <stop offset="100%" stopColor="#DF3F8F" />
        </linearGradient>
        <radialGradient id={shine} cx="30%" cy="22%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="3" y="4.5" width="34" height="34" rx="12" fill="#6400FC" opacity="0.35" />
      <rect x="1" y="1" width="36" height="36" rx="13" fill={`url(#${fill})`} />
      <rect x="1" y="1" width="36" height="36" rx="13" fill={`url(#${shine})`} />
      <rect
        x="2.2"
        y="2.2"
        width="33.6"
        height="33.6"
        rx="12"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.28"
      />
      <path d="M12 15.2h16" stroke="#fff" strokeWidth="3.1" strokeLinecap="round" />
      <path d="M20 15.2v11.4" stroke="#fff" strokeWidth="3.1" strokeLinecap="round" />
      <circle cx="27.6" cy="28.2" r="2.15" fill="#FFE7F4" />
    </svg>
  );
}

type TebnuLogoProps = {
  className?: string;
  large?: boolean;
};

export function TebnuLogo({ className, large = false }: TebnuLogoProps) {
  if (large) {
    return (
      <div className={className}>
        <div className="flex items-center gap-3">
          <TebnuMark className="size-14 drop-shadow-[0_10px_18px_rgba(100,0,252,0.45)]" />
          <span className="text-[1.7rem] font-extrabold tracking-tight text-white">Tebnu</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <svg viewBox="0 0 132 32" className="h-8 w-auto" aria-label="Tebnu">
        <circle cx="16" cy="16" r="14" fill="#6400FC" />
        <path d="M10 20.5c3.2-6.4 8.8-6.4 12 0" fill="none" stroke="#DF3F8F" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="13" cy="13" r="1.6" fill="#fff" />
        <circle cx="19" cy="13" r="1.6" fill="#fff" />
        <text x="38" y="22" fill="#fff" fontFamily="Manrope, sans-serif" fontSize="20" fontWeight="800">
          Tebnu
        </text>
      </svg>
    </div>
  );
}
