// src/index.ts
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

// src/routes/admin.routes.ts
import { Router } from "express";

// src/services/store.ts
import { randomUUID } from "node:crypto";
var responses = [];
var events = [];
function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
function addMemoryResponse(doc) {
  const id = randomUUID();
  responses.unshift({ ...doc, id });
  return id;
}
function listMemoryResponses() {
  return responses;
}
function getMemoryResponse(id) {
  return responses.find((item) => item.id === id) ?? null;
}
function addMemoryEvent(doc) {
  events.push({ ...doc, id: randomUUID() });
}
function listMemoryEvents() {
  return events;
}

// src/services/supabase.ts
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
var client = null;
function isSupabaseConfigured2() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
function getSupabase() {
  if (!isSupabaseConfigured2()) {
    throw new Error("Supabase server configuration is missing.");
  }
  if (!client) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { transport: ws }
    });
  }
  return client;
}

// src/services/live.ts
var clients = /* @__PURE__ */ new Set();
var revision = "0:0";
var publishTimer = null;
var realtimeStarted = false;
async function currentRevision() {
  if (!isSupabaseConfigured()) {
    revision = `local:${listMemoryResponses().length}:${listMemoryEvents().length}`;
    return revision;
  }
  const [responses2, events2] = await Promise.all([
    getSupabase().from("survey_responses").select("id", { count: "exact", head: true }),
    getSupabase().from("survey_events").select("id", { count: "exact", head: true })
  ]);
  revision = `${responses2.count ?? 0}:${events2.count ?? 0}`;
  return revision;
}
function notifyAdminChange() {
  if (publishTimer) return;
  publishTimer = setTimeout(() => {
    publishTimer = null;
    void currentRevision().then((next) => {
      for (const client2 of clients) client2.send({ type: "change", revision: next });
    }).catch((error) => {
      console.error("Failed to publish admin update", error);
    });
  }, 200);
}
async function attachAdminStream(res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const client2 = {
    send: (payload) => {
      res.write(`data: ${JSON.stringify(payload)}

`);
    }
  };
  clients.add(client2);
  const ping = setInterval(() => {
    res.write(": ping\n\n");
  }, 25e3);
  try {
    client2.send({ type: "hello", revision: await currentRevision() });
  } catch (error) {
    console.error("Failed to read admin revision", error);
  }
  res.on("close", () => {
    clearInterval(ping);
    clients.delete(client2);
  });
}
function startAdminRealtime() {
  if (realtimeStarted || !isSupabaseConfigured()) return;
  realtimeStarted = true;
  try {
    getSupabase().channel("tebnu-admin-live").on("postgres_changes", { event: "*", schema: "public", table: "survey_responses" }, () => notifyAdminChange()).on("postgres_changes", { event: "*", schema: "public", table: "survey_events" }, () => notifyAdminChange()).subscribe((status) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        console.warn("Admin realtime is unavailable. Updates from this API will still refresh open dashboards.");
      }
    });
  } catch (error) {
    console.warn("Admin realtime could not start. Updates from this API will still refresh open dashboards.", error);
  }
}

// src/schemas/survey.schema.ts
import { z } from "zod";

// ../shared/types.ts
var QUESTIONNAIRE_VERSION = "1.0";

// ../shared/questionnaire.ts
var questionnaire = [
  {
    id: "categories",
    type: "multiple",
    maxSelections: 3,
    title: "What kind of help would you actually use?",
    subtitle: "Choose up to 3.",
    icon: "sparkles",
    layout: "compact",
    options: [
      { value: "cleaning", label: "Cleaning" },
      { value: "cooking", label: "Cooking" },
      { value: "pickup_delivery", label: "Pick up & delivery" },
      { value: "babysitting", label: "Babysitting / Childcare" },
      { value: "technical", label: "Technical Help" },
      { value: "beauty", label: "Beauty & Personal Care" },
      { value: "heavy_lifting", label: "Heavy Lifting & Moving Help" },
      { value: "coaching", label: "Coaching & Lessons" },
      { value: "shopping", label: "Shopping & Errands" },
      { value: "pet", label: "Pet Help" },
      { value: "elderly", label: "Elderly Help" },
      { value: "paperwork", label: "Paperwork & Bureaucracy Help" },
      { value: "event", label: "Event Help" },
      { value: "home_maintenance", label: "Home Maintenance" },
      { value: "digital_creative", label: "Digital & Creative Help" },
      { value: "religious_community", label: "Religious / Community Help" },
      { value: "other", label: "Other", isOther: true },
      { value: "none", label: "I wouldn't use any", exclusive: true }
    ]
  },
  {
    id: "currentMethod",
    type: "multiple",
    title: "When you need help like this, how do you usually find someone?",
    icon: "search",
    layout: "compact",
    options: [
      { value: "friends_family", label: "Friends / family" },
      { value: "social_groups", label: "WhatsApp / Facebook groups" },
      { value: "google", label: "Google" },
      { value: "professional_websites", label: "Professional service websites" },
      { value: "already_know", label: "Someone I already know" },
      { value: "do_myself", label: "I usually do it myself" },
      { value: "other", label: "Other", isOther: true }
    ]
  },
  {
    id: "preferredDiscovery",
    type: "multiple",
    maxSelections: 3,
    title: "If you needed help with something, how would you prefer to find the right person?",
    subtitle: "Choose up to 3.",
    icon: "users",
    layout: "detailed",
    options: [
      {
        value: "browse_yourself",
        label: "Search and browse people yourself",
        description: "See profiles, prices and reviews and choose someone."
      },
      {
        value: "post_receive_offers",
        label: "Post what you need and receive offers",
        description: "Describe the task and let interested people respond."
      },
      {
        value: "nearby_people",
        label: "See people available near you",
        description: "Find people nearby who can help."
      },
      {
        value: "automatic_matching",
        label: "Get matched automatically",
        description: "Describe what you need and receive a few suitable matches."
      },
      {
        value: "ranked_list",
        label: "See a ranked list of recommended people",
        description: "Based on reviews, experience and previous work."
      },
      {
        value: "local_community",
        label: "Ask through a local community",
        description: "Post your request and get recommendations from people nearby."
      },
      {
        value: "guided_message",
        label: "Describe what you need in a simple message",
        description: "Explain the problem and be guided toward the right person."
      },
      {
        value: "direct_contact",
        label: "Contact someone directly",
        description: "Find their details and call or message them yourself."
      },
      {
        value: "single_recommendation",
        label: "Get one recommended person",
        description: "Instead of searching, have someone suitable recommended to you."
      },
      { value: "other", label: "Other", isOther: true }
    ]
  },
  {
    id: "trustFactors",
    type: "multiple",
    maxSelections: 3,
    title: "What would make you trust someone enough to hire them?",
    subtitle: "Choose up to 3.",
    icon: "shield",
    layout: "compact",
    options: [
      { value: "reviews", label: "Reviews" },
      { value: "verified_identity", label: "Verified identity" },
      { value: "real_profile", label: "Real profile / photo" },
      { value: "previous_jobs", label: "Previous completed jobs" },
      { value: "lives_nearby", label: "Lives nearby" },
      { value: "chat_before", label: "Chat before deciding" },
      { value: "recommendations", label: "Recommendation from other people" },
      { value: "clear_price", label: "Clear price" },
      { value: "other", label: "Other", isOther: true }
    ]
  },
  {
    id: "barriers",
    type: "multiple",
    maxSelections: 2,
    title: "What is the biggest reason you sometimes don't ask someone for help?",
    subtitle: "Choose up to 2.",
    icon: "help",
    layout: "compact",
    options: [
      { value: "dont_know_trust", label: "I don't know who to trust" },
      { value: "too_expensive", label: "It is too expensive" },
      { value: "takes_too_much_time", label: "It takes too much time to find someone" },
      { value: "stranger_in_home", label: "I don't want a stranger in my home" },
      { value: "dont_know_where", label: "I don't know where to look" },
      { value: "not_available", label: "People aren't available when I need them" },
      { value: "prefer_myself", label: "I prefer doing it myself" },
      { value: "quality_worry", label: "I worry about the quality of the work" },
      { value: "language", label: "Language makes it difficult" },
      { value: "dont_need_help", label: "I don't usually need help" },
      { value: "other", label: "Other", isOther: true }
    ]
  }
];

// src/utils/sanitize.ts
var MAX_OTHER_LENGTH = 300;
function sanitizeOtherText(value) {
  if (typeof value !== "string") return void 0;
  const stripped = value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!stripped) return void 0;
  return stripped.slice(0, MAX_OTHER_LENGTH);
}
function deviceTypeFromUserAgent(userAgent) {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
  if (/mobi|iphone|android/.test(ua)) return "mobile";
  return "desktop";
}

// src/schemas/survey.schema.ts
var OTHER_MAX = 300;
var questionIds = [
  "categories",
  "currentMethod",
  "preferredDiscovery",
  "trustFactors",
  "barriers"
];
function validateQuestion(questionId, values, other) {
  const question = questionnaire.find((item) => item.id === questionId);
  if (!question) return "Unknown question";
  const allowed = new Set(question.options.map((option) => option.value));
  const unique = [...new Set(values)];
  const exclusive = question.options.find((option) => option.exclusive)?.value;
  const otherOption = question.options.find((option) => option.isOther)?.value;
  if (unique.length === 0) return "At least one answer is required";
  if (unique.length !== values.length) return "Duplicate selections are not allowed";
  if (unique.some((value) => !allowed.has(value))) return "Invalid option selected";
  if (exclusive && unique.includes(exclusive) && unique.length > 1) {
    return "That option cannot be combined with others";
  }
  if (question.maxSelections && unique.length > question.maxSelections) {
    return `Maximum ${question.maxSelections} selections allowed`;
  }
  if (other && otherOption && !unique.includes(otherOption)) {
    return "Other text requires Other to be selected";
  }
  return null;
}
var surveySubmitSchema = z.object({
  questionnaireVersion: z.literal(QUESTIONNAIRE_VERSION),
  answers: z.object({
    categories: z.array(z.string()),
    categoriesOther: z.string().max(OTHER_MAX).optional(),
    currentMethod: z.array(z.string()),
    currentMethodOther: z.string().max(OTHER_MAX).optional(),
    preferredDiscovery: z.array(z.string()),
    preferredDiscoveryOther: z.string().max(OTHER_MAX).optional(),
    trustFactors: z.array(z.string()),
    trustFactorsOther: z.string().max(OTHER_MAX).optional(),
    barriers: z.array(z.string()),
    barriersOther: z.string().max(OTHER_MAX).optional()
  })
}).superRefine((payload, ctx) => {
  const pairs = [
    ["categories", payload.answers.categories, payload.answers.categoriesOther],
    ["currentMethod", payload.answers.currentMethod, payload.answers.currentMethodOther],
    ["preferredDiscovery", payload.answers.preferredDiscovery, payload.answers.preferredDiscoveryOther],
    ["trustFactors", payload.answers.trustFactors, payload.answers.trustFactorsOther],
    ["barriers", payload.answers.barriers, payload.answers.barriersOther]
  ];
  for (const [id, values, other] of pairs) {
    const error = validateQuestion(id, values, other);
    if (error) {
      ctx.addIssue({ code: "custom", message: error, path: ["answers", id] });
    }
  }
}).transform((payload) => ({
  questionnaireVersion: payload.questionnaireVersion,
  answers: {
    ...payload.answers,
    categoriesOther: sanitizeOtherText(payload.answers.categoriesOther),
    currentMethodOther: sanitizeOtherText(payload.answers.currentMethodOther),
    preferredDiscoveryOther: sanitizeOtherText(payload.answers.preferredDiscoveryOther),
    trustFactorsOther: sanitizeOtherText(payload.answers.trustFactorsOther),
    barriersOther: sanitizeOtherText(payload.answers.barriersOther)
  }
}));
var surveyEventSchema = z.object({
  sessionId: z.string().min(8).max(80).regex(/^[a-zA-Z0-9_-]+$/),
  event: z.enum(["landing_view", "survey_start", "question_view", "survey_complete"]),
  questionId: z.enum(questionIds).optional()
});
var analyticsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional()
});

// src/services/analytics.ts
function parseDate(value) {
  if (!value) return void 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? void 0 : date;
}
function toIso(value) {
  if (!value) return (/* @__PURE__ */ new Date(0)).toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return (/* @__PURE__ */ new Date(0)).toISOString();
}
function rowToStored(row) {
  return {
    id: row.id,
    answers: row.answers,
    metadata: {
      submittedAt: row.submitted_at,
      questionnaireVersion: row.questionnaire_version,
      language: "en",
      deviceType: row.device_type ?? void 0,
      userAgent: row.user_agent
    }
  };
}
function matchesFilters(doc, filters) {
  const from = parseDate(filters.from);
  const to = parseDate(filters.to);
  const submitted = new Date(toIso(doc.metadata.submittedAt));
  if (from && submitted < from) return false;
  if (to && submitted > to) return false;
  if (filters.category && filters.category !== "all" && !doc.answers.categories.includes(filters.category)) {
    return false;
  }
  return true;
}
async function loadResponses(filters) {
  if (!isSupabaseConfigured()) {
    return listMemoryResponses().map((doc) => memoryToStored(doc)).filter((doc) => matchesFilters(doc, filters));
  }
  const from = parseDate(filters.from);
  const to = parseDate(filters.to);
  let query = getSupabase().from("survey_responses").select("*");
  if (from) query = query.gte("submitted_at", from.toISOString());
  if (to) query = query.lte("submitted_at", to.toISOString());
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(rowToStored).filter((doc) => matchesFilters(doc, { ...filters, from: void 0, to: void 0 }));
}
function memoryToStored(doc) {
  return {
    id: doc.id,
    answers: doc.answers,
    metadata: {
      ...doc.metadata,
      submittedAt: doc.metadata.submittedAt
    }
  };
}
function countOptions(values, questionId, total) {
  const question = questionnaire.find((item) => item.id === questionId);
  const counts = /* @__PURE__ */ new Map();
  for (const option of question.options) counts.set(option.value, 0);
  for (const selected of values) {
    for (const value of new Set(selected)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return question.options.map((option) => {
    const count = counts.get(option.value) ?? 0;
    return {
      key: option.value,
      label: option.label,
      count,
      percentage: total === 0 ? 0 : Number((count / total * 100).toFixed(2))
    };
  });
}
function topItem(items) {
  const ranked = items.filter((item) => item.key !== "other" && item.key !== "none");
  return ranked.sort((a, b) => b.count - a.count)[0] ?? null;
}
function toPublicDoc(doc) {
  return {
    id: doc.id,
    answers: {
      categories: doc.answers.categories ?? [],
      categories_other: doc.answers.categories_other ?? void 0,
      current_method: doc.answers.current_method ?? [],
      current_method_other: doc.answers.current_method_other ?? void 0,
      preferred_discovery: doc.answers.preferred_discovery ?? [],
      preferred_discovery_other: doc.answers.preferred_discovery_other ?? void 0,
      trust_factors: doc.answers.trust_factors ?? [],
      trust_factors_other: doc.answers.trust_factors_other ?? void 0,
      barriers: doc.answers.barriers ?? [],
      barriers_other: doc.answers.barriers_other ?? void 0
    },
    metadata: {
      submittedAt: toIso(doc.metadata.submittedAt),
      questionnaireVersion: doc.metadata.questionnaireVersion,
      language: "en",
      deviceType: doc.metadata.deviceType,
      userAgent: doc.metadata.userAgent ?? void 0
    }
  };
}
async function getQuestionAnalytics(questionId, field, filters) {
  const responses2 = await loadResponses(filters);
  const items = countOptions(
    responses2.map((response) => response.answers[field] ?? []),
    questionId,
    responses2.length
  );
  return { totalResponses: responses2.length, items };
}
async function getOverview(filters) {
  const responses2 = await loadResponses(filters);
  const from = parseDate(filters.from);
  const to = parseDate(filters.to);
  const questionViews = {
    categories: 0,
    currentMethod: 0,
    preferredDiscovery: 0,
    trustFactors: 0,
    barriers: 0
  };
  let landingViews = 0;
  let started = 0;
  let completed = 0;
  const eventRows = isSupabaseConfigured() ? await (async () => {
    let query = getSupabase().from("survey_events").select("event, question_id, created_at");
    if (from) query = query.gte("created_at", from.toISOString());
    if (to) query = query.lte("created_at", to.toISOString());
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row) => ({
      event: row.event,
      questionId: row.question_id ?? void 0
    }));
  })() : listMemoryEvents().filter((event) => {
    if (from && event.createdAt < from) return false;
    if (to && event.createdAt > to) return false;
    return true;
  });
  for (const data of eventRows) {
    if (data.event === "landing_view") landingViews += 1;
    if (data.event === "survey_start") started += 1;
    if (data.event === "survey_complete") completed += 1;
    if (data.event === "question_view" && data.questionId) {
      questionViews[data.questionId] += 1;
    }
  }
  const categories = countOptions(
    responses2.map((response) => response.answers.categories ?? []),
    "categories",
    responses2.length
  );
  const discovery = countOptions(
    responses2.map((response) => response.answers.preferred_discovery ?? []),
    "preferredDiscovery",
    responses2.length
  );
  const trust = countOptions(
    responses2.map((response) => response.answers.trust_factors ?? []),
    "trustFactors",
    responses2.length
  );
  const barriers = countOptions(
    responses2.map((response) => response.answers.barriers ?? []),
    "barriers",
    responses2.length
  );
  return {
    totalResponses: responses2.length,
    started,
    completed: completed || responses2.length,
    completionRate: started === 0 ? 0 : Number(((completed || responses2.length) / started * 100).toFixed(1)),
    startRate: landingViews === 0 ? 0 : Number((started / landingViews * 100).toFixed(1)),
    landingViews,
    topCategory: topItem(categories),
    topDiscovery: topItem(discovery),
    topTrust: topItem(trust),
    topBarrier: topItem(barriers),
    dropOff: Object.keys(questionViews).map((questionId) => ({
      questionId,
      views: questionViews[questionId]
    }))
  };
}
async function getResponses(filters) {
  const responses2 = await loadResponses(filters);
  const sorted = responses2.sort(
    (a, b) => new Date(toIso(b.metadata.submittedAt)).getTime() - new Date(toIso(a.metadata.submittedAt)).getTime()
  );
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 25;
  const start = (page - 1) * limit;
  return {
    items: sorted.slice(start, start + limit).map(toPublicDoc),
    page,
    limit,
    total: sorted.length
  };
}
async function getResponseById(id) {
  if (!isSupabaseConfigured()) {
    const memory = getMemoryResponse(id);
    return memory ? toPublicDoc(memoryToStored(memory)) : null;
  }
  const { data, error } = await getSupabase().from("survey_responses").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return toPublicDoc(rowToStored(data));
}
async function getOtherAnswers(filters) {
  const responses2 = await loadResponses(filters);
  const collect = (value) => value && value.trim() ? value.trim() : null;
  return {
    categories: responses2.map((item) => collect(item.answers.categories_other)).filter((item) => Boolean(item)),
    currentMethod: responses2.map((item) => collect(item.answers.current_method_other)).filter((item) => Boolean(item)),
    preferredDiscovery: responses2.map((item) => collect(item.answers.preferred_discovery_other)).filter((item) => Boolean(item)),
    trustFactors: responses2.map((item) => collect(item.answers.trust_factors_other)).filter((item) => Boolean(item)),
    barriers: responses2.map((item) => collect(item.answers.barriers_other)).filter((item) => Boolean(item))
  };
}

// src/controllers/admin.controller.ts
function filtersFromQuery(req) {
  return analyticsQuerySchema.parse(req.query);
}
async function streamAdminHandler(_req, res) {
  await attachAdminStream(res);
}
async function getOverviewHandler(req, res) {
  res.json(await getOverview(filtersFromQuery(req)));
}
async function getResponsesHandler(req, res) {
  res.json(await getResponses(filtersFromQuery(req)));
}
async function getResponseHandler(req, res) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const doc = await getResponseById(id ?? "");
  if (!doc) {
    res.status(404).json({ error: "Response not found" });
    return;
  }
  res.json(doc);
}
async function getCategoriesHandler(req, res) {
  res.json(await getQuestionAnalytics("categories", "categories", filtersFromQuery(req)));
}
async function getCurrentMethodHandler(req, res) {
  res.json(await getQuestionAnalytics("currentMethod", "current_method", filtersFromQuery(req)));
}
async function getDiscoveryHandler(req, res) {
  res.json(await getQuestionAnalytics("preferredDiscovery", "preferred_discovery", filtersFromQuery(req)));
}
async function getTrustHandler(req, res) {
  res.json(await getQuestionAnalytics("trustFactors", "trust_factors", filtersFromQuery(req)));
}
async function getBarriersHandler(req, res) {
  res.json(await getQuestionAnalytics("barriers", "barriers", filtersFromQuery(req)));
}
async function getOtherHandler(req, res) {
  res.json(await getOtherAnswers(filtersFromQuery(req)));
}

// src/middleware/auth.ts
async function requireAdmin(req, res, next) {
  if (!isSupabaseConfigured2() && process.env.NODE_ENV !== "production") {
    req.adminUid = "local-demo";
    next();
    return;
  }
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing authentication token" });
      return;
    }
    const token = header.slice("Bearer ".length);
    const { data, error } = await getSupabase().auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ error: "Invalid or expired authentication token" });
      return;
    }
    const adminResult = await getSupabase().from("admins").select("role, active").eq("id", data.user.id).maybeSingle();
    const admin = adminResult.data;
    if (adminResult.error || !admin || admin.role !== "admin" || admin.active !== true) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    req.adminUid = data.user.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired authentication token" });
  }
}

// src/middleware/rateLimit.ts
import rateLimit from "express-rate-limit";
var surveySubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." }
});
var eventLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many events. Please try again later." }
});
var adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

// src/routes/admin.routes.ts
var adminRouter = Router();
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

// src/routes/survey.routes.ts
import { Router as Router2 } from "express";

// src/services/survey.ts
async function saveSurveyResponse(input) {
  const answers = {
    categories: input.answers.categories,
    categories_other: input.answers.categoriesOther ?? null,
    current_method: input.answers.currentMethod,
    current_method_other: input.answers.currentMethodOther ?? null,
    preferred_discovery: input.answers.preferredDiscovery,
    preferred_discovery_other: input.answers.preferredDiscoveryOther ?? null,
    trust_factors: input.answers.trustFactors,
    trust_factors_other: input.answers.trustFactorsOther ?? null,
    barriers: input.answers.barriers,
    barriers_other: input.answers.barriersOther ?? null
  };
  if (!isSupabaseConfigured()) {
    const id = addMemoryResponse({
      answers,
      metadata: {
        submittedAt: /* @__PURE__ */ new Date(),
        questionnaireVersion: input.questionnaireVersion,
        language: "en",
        deviceType: deviceTypeFromUserAgent(input.userAgent),
        userAgent: input.userAgent?.slice(0, 300) ?? null
      }
    });
    notifyAdminChange();
    return id;
  }
  const { data, error } = await getSupabase().from("survey_responses").insert({
    answers,
    questionnaire_version: input.questionnaireVersion,
    language: "en",
    device_type: deviceTypeFromUserAgent(input.userAgent),
    user_agent: input.userAgent?.slice(0, 300) ?? null
  }).select("id").single();
  if (error) throw error;
  notifyAdminChange();
  return data.id;
}
async function saveSurveyEvent(input) {
  if (!isSupabaseConfigured()) {
    addMemoryEvent({
      sessionId: input.sessionId,
      event: input.event,
      questionId: input.questionId ?? null,
      createdAt: /* @__PURE__ */ new Date()
    });
    notifyAdminChange();
    return;
  }
  const { error } = await getSupabase().from("survey_events").insert({
    session_id: input.sessionId,
    event: input.event,
    question_id: input.questionId ?? null
  });
  if (error) throw error;
  notifyAdminChange();
}

// src/controllers/survey.controller.ts
async function submitSurvey(req, res) {
  const parsed = surveySubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid survey submission",
      details: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }
  const id = await saveSurveyResponse({
    answers: parsed.data.answers,
    questionnaireVersion: parsed.data.questionnaireVersion,
    userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : void 0
  });
  res.status(201).json({ ok: true, id });
}
async function trackEvent(req, res) {
  const parsed = surveyEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid event" });
    return;
  }
  await saveSurveyEvent(parsed.data);
  res.status(204).end();
}

// src/routes/survey.routes.ts
var surveyRouter = Router2();
surveyRouter.post("/", surveySubmitLimiter, submitSurvey);
surveyRouter.post("/events", eventLimiter, trackEvent);

// src/index.ts
dotenv.config();
var app = express();
var port = Number(process.env.PORT ?? 4e3);
var origin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173,http://localhost:5174,http://localhost:5175";
app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin: origin.split(",").map((value) => value.trim()),
    credentials: true
  })
);
app.use(express.json({ limit: "32kb" }));
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/survey", surveyRouter);
app.use("/api/admin", adminRouter);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
});
var index_default = app;
if (process.env.VERCEL) {
  startAdminRealtime();
} else {
  app.listen(port, () => {
    const mode = process.env.SUPABASE_URL ? "Supabase" : "local memory store";
    console.log(`Tebnu API listening on http://localhost:${port} (${mode})`);
    startAdminRealtime();
  });
}
export {
  index_default as default
};
