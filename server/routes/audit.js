import { Router } from "express";
import { getDb } from "../db";
import logger from "../lib/logger";
import { authMiddleware } from "../middleware/auth";
const router = Router();
router.use(authMiddleware);
router.get("/", async (req, res) => {
    try {
        const db = await getDb();
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const offset = parseInt(req.query.offset) || 0;
        const result = await db.listAuditLogs({ userId: req.userId, limit, offset });
        res.json(result);
    }
    catch (err) {
        logger.error({ err, userId: req.userId }, "Erro ao listar audit logs");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
router.post("/", async (req, res) => {
    try {
        const db = await getDb();
        const log = await db.createAuditLog({ ...req.body, user_id: req.userId });
        logger.info({ eventId: log.event_id }, "Audit log criado");
        res.status(201).json({ log });
    }
    catch (err) {
        logger.error({ err, userId: req.userId }, "Erro ao criar audit log");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
export default router;
