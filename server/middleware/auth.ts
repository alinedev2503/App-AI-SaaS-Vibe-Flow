import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { getDb } from "../db";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwt_secret) as { userId: string; email: string; role: string };
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
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}
