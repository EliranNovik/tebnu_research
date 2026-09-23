const SESSION_KEY = "tebnu_survey_session";

export function getSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = `s_${crypto.randomUUID().replaceAll("-", "")}`;
  localStorage.setItem(SESSION_KEY, id);
  return id;
}
