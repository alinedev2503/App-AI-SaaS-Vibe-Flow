import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { getDb } from "../db";
import logger from "../lib/logger";
import { authMiddleware } from "../middleware/auth";
const router = Router();
router.use(authMiddleware);
const handleValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return false;
    }
    return true;
};
router.get("/", async (req, res) => {
    try {
        const db = await getDb();
        const agents = await db.listAgents(req.userId);
        logger.debug({ userId: req.userId, count: agents.length }, "Agentes listados");
        res.json({ agents });
    }
    catch (err) {
        logger.error({ err, userId: req.userId }, "Erro ao listar agentes");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
router.get("/:id", [
    param("id").isUUID().withMessage("ID de agente inválido"),
], async (req, res) => {
    if (!handleValidation(req, res))
        return;
    try {
        const db = await getDb();
        const agent = await db.getAgent(req.params.id);
        if (!agent) {
            res.status(404).json({ error: "Agente não encontrado" });
            return;
        }
        res.json({ agent });
    }
    catch (err) {
        logger.error({ err, agentId: req.params.id }, "Erro ao buscar agente");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
router.post("/", [
    body("name").trim().isLength({ min: 1, max: 100 }).withMessage("Nome é obrigatório (max 100 caracteres)"),
    body("role").trim().isLength({ min: 1, max: 200 }).withMessage("Função é obrigatória"),
], async (req, res) => {
    if (!handleValidation(req, res))
        return;
    try {
        const db = await getDb();
        const agent = await db.createAgent({ ...req.body, user_id: req.userId });
        await db.createAuditLog({ user_id: req.userId, event_id: `AGT-${Date.now()}`, actor: req.userEmail || "unknown", actor_type: "user", action: `Agente "${agent.name}" criado`, status: "success" });
        logger.info({ agentId: agent.id, name: agent.name }, "Agente criado");
        res.status(201).json({ agent });
    }
    catch (err) {
        logger.error({ err, userId: req.userId }, "Erro ao criar agente");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
router.put("/:id", [
    param("id").isUUID().withMessage("ID de agente inválido"),
], async (req, res) => {
    if (!handleValidation(req, res))
        return;
    try {
        const db = await getDb();
        const agent = await db.updateAgent(req.params.id, req.body);
        if (!agent) {
            res.status(404).json({ error: "Agente não encontrado" });
            return;
        }
        await db.createAuditLog({ user_id: req.userId, event_id: `AGT-${Date.now()}`, actor: req.userEmail || "unknown", actor_type: "user", action: `Agente "${agent.name}" atualizado`, status: "success" });
        logger.info({ agentId: agent.id, name: agent.name }, "Agente atualizado");
        res.json({ agent });
    }
    catch (err) {
        logger.error({ err, agentId: req.params.id }, "Erro ao atualizar agente");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
router.delete("/:id", [
    param("id").isUUID().withMessage("ID de agente inválido"),
], async (req, res) => {
    if (!handleValidation(req, res))
        return;
    try {
        const db = await getDb();
        const agent = await db.getAgent(req.params.id);
        if (agent) {
            await db.createAuditLog({ user_id: req.userId, event_id: `AGT-${Date.now()}`, actor: req.userEmail || "unknown", actor_type: "user", action: `Agente "${agent.name}" removido`, status: "success" });
            logger.info({ agentId: agent.id, name: agent.name }, "Agente removido");
        }
        await db.deleteAgent(req.params.id);
        res.json({ message: "Agente removido" });
    }
    catch (err) {
        logger.error({ err, agentId: req.params.id }, "Erro ao remover agente");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
export default router;
