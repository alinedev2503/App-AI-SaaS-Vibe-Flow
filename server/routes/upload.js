import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import logger from "../lib/logger";
import { authMiddleware } from "../middleware/auth";
const router = Router();
const uploadDir = path.resolve(process.cwd(), "data/uploads");
if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${crypto.randomUUID()}${ext}`);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [".svg", ".png", ".jpg", ".jpeg", ".ico", ".webp"];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    },
});
router.use(authMiddleware);
router.post("/branding", upload.single("file"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
    }
    logger.info({ filename: req.file.filename, size: req.file.size, userId: req.userId }, "Upload de branding");
    res.json({
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        size: req.file.size,
    });
});
export default router;
