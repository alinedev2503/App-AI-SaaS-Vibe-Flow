import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { config } from "./config";
import logger from "./lib/logger";
import authRoutes from "./routes/auth";
import agentRoutes from "./routes/agents";
import auditRoutes from "./routes/audit";
import approvalRoutes from "./routes/approvals";
import apiKeyRoutes from "./routes/api-keys";
import uploadRoutes from "./routes/upload";
import statsRoutes from "./routes/stats";
import adminRoutes from "./routes/admin";

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cors({
  origin: config.app_url,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "1mb" }));

const globalLimiter = process.env.NODE_ENV === "test"
  ? ((_req: any, _res: any, next: any) => next()) as any
  : rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Muitas requisições. Tente novamente em 15 minutos." },
  });
app.use("/api/", globalLimiter);

if (config.jwt_secret === "vibeflow-dev-secret-change-in-production") {
  logger.warn("JWT_SECRET está usando o valor padrão. Gere um secreto aleatório para produção.");
  logger.warn("Execute: node scripts/generate-secret.js");
}

const uploadsDir = path.resolve(process.cwd(), "data/uploads");
if (fs.existsSync(uploadsDir)) {
  app.use("/uploads", express.static(uploadsDir));
}

const distDir = path.resolve(process.cwd(), "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    db: config.db_type,
    timestamp: new Date().toISOString(),
    security: {
      helmet: true,
      rate_limit: true,
      jwt_secret_ok: config.jwt_secret !== "vibeflow-dev-secret-change-in-production",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/api-keys", apiKeyRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/auth/users", adminRoutes);

app.get(/^\/(?!api\/|uploads\/).*/, (_req, res) => {
  const indexPath = path.resolve(process.cwd(), "dist/index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Rota não encontrada" });
  }
});

app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err, path: _req.path }, "Erro não tratado");
  res.status(err.status || 500).json({
    error: "Erro interno do servidor",
    ...(config.jwt_secret === "vibeflow-dev-secret-change-in-production" && { detail: err.message }),
  });
});

export default app;
