import { Router } from "express";
import crypto from "crypto";
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
        const keys = await db.listApiKeys(req.userId);
        logger.debug({ count: keys.length }, "API keys listadas");
        res.json({ keys });
    }
    catch (err) {
        logger.error({ err, userId: req.userId }, "Erro ao listar API keys");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
router.post("/", [
    body("name").trim().isLength({ min: 1, max: 50 }).withMessage("Nome é obrigatório (max 50 caracteres)"),
], async (req, res) => {
    if (!handleValidation(req, res))
        return;
    try {
        const rawKey = `vf_${crypto.randomBytes(32).toString("hex")}`;
        const prefix = rawKey.slice(0, 8);
        const db = await getDb();
        const key = await db.createApiKey({ user_id: req.userId, name: req.body.name, key_prefix: prefix });
        logger.info({ keyId: key.id, name: key.name }, "API Key criada");
        res.status(201).json({ key, raw_key: rawKey });
    }
    catch (err) {
        logger.error({ err, userId: req.userId }, "Erro ao criar API key");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
router.delete("/:id", [
    param("id").isUUID().withMessage("ID de chave inválido"),
], async (req, res) => {
    if (!handleValidation(req, res))
        return;
    try {
        const db = await getDb();
        await db.deleteApiKey(req.params.id);
        logger.info({ keyId: req.params.id }, "API Key removida");
        res.json({ message: "Chave removida" });
    }
    catch (err) {
        logger.error({ err, keyId: req.params.id }, "Erro ao remover API key");
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
export default router;
