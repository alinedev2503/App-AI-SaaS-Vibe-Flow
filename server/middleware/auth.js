import jwt from "jsonwebtoken";
import { config } from "../config";
import { getDb } from "../db";
export async function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token não fornecido" });
        return;
    }
    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, config.jwt_secret);
        const db = await getDb();
        const session = await db.findSessionByToken(token);
        if (!session) {
            res.status(401).json({ error: "Sessão expirada ou inválida" });
            return;
        }
        req.userId = payload.userId;
        req.userEmail = payload.email;
        req.userRole = payload.role;
        next();
    }
    catch {
        res.status(401).json({ error: "Token inválido" });
    }
}
