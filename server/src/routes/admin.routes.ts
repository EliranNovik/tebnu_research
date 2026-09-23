import { Router } from "express";
import {
  getBarriersHandler,
  getCategoriesHandler,
  getCurrentMethodHandler,
  getDiscoveryHandler,
  getOtherHandler,
  getOverviewHandler,
  getResponseHandler,
  streamAdminHandler,
  getResponsesHandler,
  getTrustHandler,
} from "../controllers/admin.controller";
import { requireAdmin } from "../middleware/auth";
import { adminLimiter } from "../middleware/rateLimit";

export const adminRouter = Router();

adminRouter.use(adminLimiter, requireAdmin);

adminRouter.get("/stream", streamAdminHandler);
adminRouter.get("/overview", getOverviewHandler);
adminRouter.get("/responses", getResponsesHandler);
adminRouter.get("/responses/:id", getResponseHandler);
adminRouter.get("/analytics/categories", getCategoriesHandler);
adminRouter.get("/analytics/current-method", getCurrentMethodHandler);
adminRouter.get("/analytics/discovery", getDiscoveryHandler);
adminRouter.get("/analytics/trust", getTrustHandler);
adminRouter.get("/analytics/barriers", getBarriersHandler);
adminRouter.get("/analytics/other", getOtherHandler);
