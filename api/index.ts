import { createExpressApp } from "../server/app";
import { getDb } from "../server/db";

let cachedApp: any = null;

export default async function handler(req: any, res: any) {
  try {
    await getDb();
    if (!cachedApp) {
      cachedApp = await createExpressApp();
    }
    return cachedApp(req, res);
  } catch (err: any) {
    return res.status(500).json({ error: "Falha na inicialização do servidor", message: err.message });
  }
}

