const express = require("express");
const net = require("node:net");
const https = require("node:https");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 10000;
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));

const TARGETS = [
  { name: "Cloudflare HTTPS", host: "www.cloudflare.com", port: 443 },
  { name: "Google HTTPS", host: "www.google.com", port: 443 },
  { name: "GitHub HTTPS", host: "github.com", port: 443 }
];

function tcpProbe(host, port, timeoutMs = 3500) {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const socket = net.createConnection({ host, port });
    let done = false;
    const finish = (ok, error = null) => {
      if (done) return;
      done = true;
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      socket.destroy();
      resolve({ ok, ms: Math.round(ms * 10) / 10, error });
    };
    socket.setTimeout(timeoutMs, () => finish(false, "timeout"));
    socket.once("connect", () => finish(true));
    socket.once("error", (e) => finish(false, e.code || "connection_error"));
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "WOLFPINGER", version: "1.0.0", time: new Date().toISOString() });
});

app.get("/api/server-probes", async (_req, res) => {
  const results = await Promise.all(TARGETS.map(async (t) => ({
    name: t.name, host: t.host, port: t.port,
    ...(await tcpProbe(t.host, t.port))
  })));
  res.json({
    note: "These are outbound TCP connection times measured from the Render server, not from your phone and not in-game ping.",
    regionHint: process.env.RENDER_REGION || "unknown",
    results
  });
});

app.get("/api/client-check", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ ok: true, receivedAt: Date.now(), serverTime: new Date().toISOString() });
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, "0.0.0.0", () => console.log(`WOLFPINGER listening on ${PORT}`));
