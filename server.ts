import { createExpressApp } from "./server/app";
import { closeDb, getDb } from "./server/db";
import logger from "./server/lib/logger";
import { config } from "./server/config";

const PORT = 3000;

async function start() {
  try {
    await getDb();
    logger.info({ db: config.db_type }, "Banco conectado");

    const app = await createExpressApp();
    app.listen(PORT, "0.0.0.0", () => {
      logger.info({ port: PORT }, `Server running on http://localhost:${PORT}`);
      logger.info({ url: `http://localhost:${PORT}/api/health` }, "Health check");
    });
  } catch (err) {
    logger.fatal({ err }, "Falha ao iniciar servidor");
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  logger.info("Sinal SIGINT recebido. Encerrando...");
  await closeDb();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Sinal SIGTERM recebido. Encerrando...");
  await closeDb();
  process.exit(0);
});

start();
