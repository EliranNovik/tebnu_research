import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { adminRouter } from "./routes/admin.routes";
import { surveyRouter } from "./routes/survey.routes";
import { startAdminRealtime } from "./services/live";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const origin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173,http://localhost:5174,http://localhost:5175";

app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: origin.split(",").map((value) => value.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/survey", surveyRouter);
app.use("/api/admin", adminRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
});

export default app;

if (process.env.VERCEL) {
  startAdminRealtime();
} else {
  app.listen(port, () => {
    const mode = process.env.SUPABASE_URL ? "Supabase" : "local memory store";
    console.log(`Tebnu API listening on http://localhost:${port} (${mode})`);
    startAdminRealtime();
  });
}
