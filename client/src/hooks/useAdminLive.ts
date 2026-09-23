import { useAdminAuth } from "@/hooks/useAdminAuth";
import { applyServerRevision } from "@/services/adminCache";
import { apiUrl } from "@/services/api";
import { useEffect } from "react";

type LiveMessage = {
  type: "hello" | "change";
  revision: string;
};

export function useAdminLive() {
  const { getToken, user, configured } = useAdminAuth();

  useEffect(() => {
    if (configured && !user) return;

    let stopped = false;
    let retryMs = 1000;
    let controller: AbortController | null = null;

    async function connect() {
      if (stopped) return;
      controller = new AbortController();
      try {
        const token = (await getToken()) ?? "local-demo";
        const response = await fetch(apiUrl("/api/admin/stream"), {
          headers: {
            Accept: "text/event-stream",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        if (!response.ok || !response.body) throw new Error("Live stream failed");

        retryMs = 1000;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!stopped) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            const line = part.split("\n").find((item) => item.startsWith("data: "));
            if (!line) continue;
            const message = JSON.parse(line.slice(6)) as LiveMessage;
            if (message.revision) applyServerRevision(message.revision);
          }
        }
      } catch {
        if (stopped) return;
      }

      if (!stopped) {
        window.setTimeout(() => {
          void connect();
        }, retryMs);
        retryMs = Math.min(retryMs * 2, 15000);
      }
    }

    void connect();
    return () => {
      stopped = true;
      controller?.abort();
    };
  }, [configured, getToken, user]);
}
