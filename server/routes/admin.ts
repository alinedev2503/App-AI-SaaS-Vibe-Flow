import { Router, Response } from "express";
import { getDb } from "../db";
import logger from "../lib/logger";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== "admin") {
      res.status(403).json({ error: "Acesso restrito a administradores" });
      return;
    }
    const db = await getDb();
    const users = await db.listUsers();
    res.json({ users });
  } catch (err) {
    logger.error({ err }, "Erro ao listar usuários");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.put("/:id/role", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== "admin") {
      res.status(403).json({ error: "Acesso restrito a administradores" });
      return;
    }
    const { role } = req.body;
    if (!["admin", "operator", "viewer"].includes(role)) {
      res.status(400).json({ error: "Perfil inválido" });
      return;
    }
    const db = await getDb();
    await db.updateUserRole(req.params.id, role);
    await db.createAuditLog({ user_id: req.userId!, event_id: `ROL-${Date.now()}`, actor: req.userEmail || "unknown", actor_type: "user", action: `Permissão alterada para ${role}`, status: "success" });
    res.json({ message: "Permissão atualizada" });
  } catch (err) {
    logger.error({ err }, "Erro ao atualizar perfil");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
