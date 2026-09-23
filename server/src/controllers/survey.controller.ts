import type { Request, Response } from "express";
import { surveyEventSchema, surveySubmitSchema } from "../schemas/survey.schema";
import { saveSurveyEvent, saveSurveyResponse } from "../services/survey";

export async function submitSurvey(req: Request, res: Response) {
  const parsed = surveySubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid survey submission",
      details: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const id = await saveSurveyResponse({
    answers: parsed.data.answers,
    questionnaireVersion: parsed.data.questionnaireVersion,
    language: parsed.data.language,
    userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined,
  });

  res.status(201).json({ ok: true, id });
}

export async function trackEvent(req: Request, res: Response) {
  const parsed = surveyEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid event" });
    return;
  }

  await saveSurveyEvent(parsed.data);
  res.status(204).end();
}
