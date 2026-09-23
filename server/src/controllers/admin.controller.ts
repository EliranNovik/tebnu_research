import type { Request, Response } from "express";
import { attachAdminStream } from "../services/live";
import { analyticsQuerySchema } from "../schemas/survey.schema";
import {
  getOtherAnswers,
  getOverview,
  getQuestionAnalytics,
  getResponseById,
  getResponses,
} from "../services/analytics";

function filtersFromQuery(req: Request) {
  return analyticsQuerySchema.parse(req.query);
}

export async function streamAdminHandler(_req: Request, res: Response) {
  await attachAdminStream(res);
}

export async function getOverviewHandler(req: Request, res: Response) {
  res.json(await getOverview(filtersFromQuery(req)));
}

export async function getResponsesHandler(req: Request, res: Response) {
  res.json(await getResponses(filtersFromQuery(req)));
}

export async function getResponseHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const doc = await getResponseById(id ?? "");
  if (!doc) {
    res.status(404).json({ error: "Response not found" });
    return;
  }
  res.json(doc);
}

export async function getCategoriesHandler(req: Request, res: Response) {
  res.json(await getQuestionAnalytics("categories", "categories", filtersFromQuery(req)));
}

export async function getCurrentMethodHandler(req: Request, res: Response) {
  res.json(await getQuestionAnalytics("currentMethod", "current_method", filtersFromQuery(req)));
}

export async function getDiscoveryHandler(req: Request, res: Response) {
  res.json(await getQuestionAnalytics("preferredDiscovery", "preferred_discovery", filtersFromQuery(req)));
}

export async function getTrustHandler(req: Request, res: Response) {
  res.json(await getQuestionAnalytics("trustFactors", "trust_factors", filtersFromQuery(req)));
}

export async function getBarriersHandler(req: Request, res: Response) {
  res.json(await getQuestionAnalytics("barriers", "barriers", filtersFromQuery(req)));
}

export async function getOtherHandler(req: Request, res: Response) {
  res.json(await getOtherAnswers(filtersFromQuery(req)));
}
