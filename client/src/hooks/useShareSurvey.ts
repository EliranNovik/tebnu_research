import { useState } from "react";

export function useShareSurvey(text: string) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.origin;
    const payload = { title: "Tebnu", text, url };

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

  return { share, copied };
}
