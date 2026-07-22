import { Router, Response } from "express";
import { getDb } from "../db";
import logger from "../lib/logger";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const stats = await db.getStats(req.userId!);
    res.json({ stats });
  } catch (err) {
    logger.error({ err, userId: req.userId }, "Erro ao buscar stats");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
