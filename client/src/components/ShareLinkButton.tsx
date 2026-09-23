import { useShareSurvey } from "@/hooks/useShareSurvey";
import { Check, Share2 } from "lucide-react";

type ShareLinkButtonProps = {
  text: string;
  label: string;
  copiedLabel: string;
};

export function ShareLinkButton({ text, label, copiedLabel }: ShareLinkButtonProps) {
  const { share, copied } = useShareSurvey(text);

  return (
    <button
      type="button"
      onClick={() => void share()}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className="inline-flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/6 text-sm font-semibold text-white hover:bg-white/10 md:w-auto md:px-4"
    >
      {copied ? <Check className="size-4 text-[#C4B4F5]" /> : <Share2 className="size-4 text-[#C4B4F5]" />}
      <span className="hidden md:inline">{copied ? copiedLabel : label}</span>
    </button>
  );
}
