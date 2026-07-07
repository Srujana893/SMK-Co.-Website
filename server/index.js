require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { ensureSchema } = require("./db");
const enquiryRoutes = require("./routes/enquiry");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const allowedOrigins = [
  "https://smkindia.com",
  "https://www.smkindia.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
  })
);

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "smk-enquiry-api" });
});

app.use("/api", enquiryRoutes);

app.use((err, _req, res, _next) => {
  console.error("[app] unhandled error", err);
  res.status(500).json({ ok: false, error: "Internal error." });
});

(async () => {
  try {
    await ensureSchema();
    console.log("[app] schema ready");
  } catch (err) {
    console.error("[app] failed to ensure schema", err);
  }
  app.listen(PORT, () => {
    console.log(`[app] listening on :${PORT}`);
  });
})();
