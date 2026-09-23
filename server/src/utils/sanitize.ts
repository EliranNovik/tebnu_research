const MAX_OTHER_LENGTH = 300;

export function sanitizeOtherText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const stripped = value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
  if (!stripped) return undefined;
  return stripped.slice(0, MAX_OTHER_LENGTH);
}

export function deviceTypeFromUserAgent(userAgent?: string): "mobile" | "tablet" | "desktop" {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
  if (/mobi|iphone|android/.test(ua)) return "mobile";
  return "desktop";
}
