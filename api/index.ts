import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../server/app";
import { getDb } from "../server/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await getDb();
    return app(req, res);
  } catch (err: any) {
    return res.status(500).json({ error: "Falha na inicialização do servidor", message: err.message });
  }
}
