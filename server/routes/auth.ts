import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import { config } from "../config";
import { getDb } from "../db";
import logger from "../lib/logger";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

const loginLimiter = process.env.NODE_ENV === "test"
  ? ((_req: any, _res: any, next: any) => next()) as any
  : rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Muitas tentativas de login. Tente novamente em 15 minutos." },
  });

router.post("/register", loginLimiter, [
  body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("password").isLength({ min: 6 }).withMessage("Senha deve ter no mínimo 6 caracteres"),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  try {
    const { email, name, password } = req.body;
    const db = await getDb();
    const existing = await db.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: "Email já cadastrado" });
      return;
    }

    const user = await db.createUser({ email, name, password, role: "operator" });
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role, jti: crypto.randomUUID() }, config.jwt_secret, { expiresIn: config.jwt_expires_in as any });
    await db.createSession({ user_id: user.id, token, expires_at: new Date(Date.now() + 7 * 86400000).toISOString() });

    await db.createAuditLog({ user_id: user.id, event_id: `REG-${Date.now()}`, actor: user.name, actor_type: "user", action: "Novo registro", status: "success" });

    res.status(201).json({ user, token });
  } catch (err) {
    logger.error({ err }, "Erro no registro");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/login", loginLimiter, [
  body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Senha é obrigatória"),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  try {
    const { email, password } = req.body;
    const db = await getDb();
    const user = await db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const [salt, hash] = user.password.split(":");
    const computed = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    if (hash !== computed) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role, jti: crypto.randomUUID() }, config.jwt_secret, { expiresIn: config.jwt_expires_in as any });
    await db.createSession({ user_id: user.id, token, expires_at: new Date(Date.now() + 7 * 86400000).toISOString() });

    await db.createAuditLog({ user_id: user.id, event_id: `LOG-${Date.now()}`, actor: user.name, actor_type: "user", action: "Login realizado", status: "success" });

    const { password: _, ...safe } = user;
    res.json({ user: safe, token });
  } catch (err) {
    logger.error({ err }, "Erro no login");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/logout", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const db = await getDb();
    await db.deleteSession(token);

    await db.createAuditLog({ user_id: req.userId!, event_id: `OUT-${Date.now()}`, actor: req.userEmail || "unknown", actor_type: "user", action: "Logout realizado", status: "success" });

    res.json({ message: "Logout realizado" });
  } catch (err) {
    logger.error({ err }, "Erro no logout");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const user = await db.findUserById(req.userId!);
    if (!user) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
    res.json({ user });
  } catch (err) {
    logger.error({ err }, "Erro ao buscar usuário");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
