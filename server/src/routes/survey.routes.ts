import { Router } from "express";
import { submitSurvey, trackEvent } from "../controllers/survey.controller";
import { eventLimiter, surveySubmitLimiter } from "../middleware/rateLimit";

export const surveyRouter = Router();

surveyRouter.post("/", surveySubmitLimiter, submitSurvey);
surveyRouter.post("/events", eventLimiter, trackEvent);
