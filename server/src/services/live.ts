import type { Response } from "express";
import { listMemoryEvents, listMemoryResponses, isSupabaseConfigured } from "./store";
import { getSupabase } from "./supabase";

type LiveClient = {
  send: (payload: { type: "hello" | "change"; revision: string }) => void;
};

const clients = new Set<LiveClient>();
let revision = "0:0";
let publishTimer: NodeJS.Timeout | null = null;
let realtimeStarted = false;

export async function currentRevision() {
  if (!isSupabaseConfigured()) {
    revision = `local:${listMemoryResponses().length}:${listMemoryEvents().length}`;
    return revision;
  }

  const [responses, events] = await Promise.all([
    getSupabase().from("survey_responses").select("id", { count: "exact", head: true }),
    getSupabase().from("survey_events").select("id", { count: "exact", head: true }),
  ]);
  revision = `${responses.count ?? 0}:${events.count ?? 0}`;
  return revision;
}

export function notifyAdminChange() {
  if (publishTimer) return;
  publishTimer = setTimeout(() => {
    publishTimer = null;
    void currentRevision()
      .then((next) => {
        for (const client of clients) client.send({ type: "change", revision: next });
      })
      .catch((error) => {
        console.error("Failed to publish admin update", error);
      });
  }, 200);
}

export async function attachAdminStream(res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const client: LiveClient = {
    send: (payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    },
  };
  clients.add(client);

  const ping = setInterval(() => {
    res.write(": ping\n\n");
  }, 25000);

  try {
    client.send({ type: "hello", revision: await currentRevision() });
  } catch (error) {
    console.error("Failed to read admin revision", error);
  }

  res.on("close", () => {
    clearInterval(ping);
    clients.delete(client);
  });
}

export function startAdminRealtime() {
  if (realtimeStarted || !isSupabaseConfigured()) return;
  realtimeStarted = true;

  try {
    getSupabase()
      .channel("tebnu-admin-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "survey_responses" }, () => notifyAdminChange())
      .on("postgres_changes", { event: "*", schema: "public", table: "survey_events" }, () => notifyAdminChange())
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Admin realtime is unavailable. Updates from this API will still refresh open dashboards.");
        }
      });
  } catch (error) {
    console.warn("Admin realtime could not start. Updates from this API will still refresh open dashboards.", error);
  }
}
