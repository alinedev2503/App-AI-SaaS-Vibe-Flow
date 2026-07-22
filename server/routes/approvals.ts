import { Router, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { getDb } from "../db";
import logger from "../lib/logger";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

const handleValidation = (req: AuthRequest, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
};

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string | undefined;
    const result = await db.listApprovals({ userId: req.userId, status, limit, offset });
    logger.debug({ count: result.total, userId: req.userId }, "Aprovações listadas");
    res.json(result);
  } catch (err) {
    logger.error({ err, userId: req.userId }, "Erro ao listar aprovações");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/", [
  body("request_id").trim().notEmpty().withMessage("request_id é obrigatório"),
  body("agent_id").trim().notEmpty().withMessage("agent_id é obrigatório"),
  body("agent_name").trim().notEmpty().withMessage("agent_name é obrigatório"),
  body("action_type").trim().notEmpty().withMessage("action_type é obrigatório"),
], async (req: AuthRequest, res: Response) => {
  if (!handleValidation(req, res)) return;
  try {
    const db = await getDb();
    const approval = await db.createApproval({ ...req.body, user_id: req.userId!, status: "pending", queue_time: "0s" });
    logger.info({ requestId: approval.request_id }, "Aprovação criada");
    res.status(201).json({ approval });
  } catch (err) {
    logger.error({ err, userId: req.userId }, "Erro ao criar aprovação");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.put("/:id", [
  param("id").isUUID().withMessage("ID de aprovação inválido"),
  body("status").isIn(["approved", "rejected"]).withMessage("Status deve ser 'approved' ou 'rejected'"),
], async (req: AuthRequest, res: Response) => {
  if (!handleValidation(req, res)) return;
  try {
    const db = await getDb();
    const approval = await db.updateApproval(req.params.id, req.body);
    if (!approval) { res.status(404).json({ error: "Aprovação não encontrada" }); return; }

    await db.createAuditLog({ user_id: req.userId!, event_id: `APR-${Date.now()}`, actor: req.userEmail || "unknown", actor_type: "user", action: `Aprovação #${approval.request_id} ${req.body.status === "approved" ? "aprovada" : "rejeitada"}`, status: "success" });

    logger.info({ approvalId: approval.id, status: req.body.status }, "Aprovação atualizada");
    res.json({ approval });
  } catch (err) {
    logger.error({ err, approvalId: req.params.id }, "Erro ao atualizar aprovação");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
