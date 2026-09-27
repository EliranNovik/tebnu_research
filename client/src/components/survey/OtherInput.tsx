import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef } from "react";

type OtherInputProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
};

export function OtherInput({ value, placeholder, onChange, className }: OtherInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const field = ref.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight}px`;
  }, [value]);

  return (
    <div className={cn("ps-9", className)}>
      <textarea
        ref={ref}
        value={value}
        rows={1}
        maxLength={300}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value.slice(0, 300))}
        className={cn(
          "min-h-12 w-full resize-none overflow-hidden rounded-xl border border-white/15 bg-white/[0.06] px-3 py-3 text-base text-white placeholder:text-white/45",
          "focus-visible:border-[#865BFF] focus-visible:ring-[3px] focus-visible:ring-[#865BFF]/20 focus-visible:outline-none",
        )}
      />
    </div>
  );
}
