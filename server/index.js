import app from "./app";
import { closeDb, getDb } from "./db";
import logger from "./lib/logger";
import { config } from "./config";
async function start() {
    try {
        await getDb();
        logger.info({ db: config.db_type }, "Banco conectado");
        app.listen(config.port, () => {
            logger.info({ port: config.port }, "API rodando");
            logger.info({ url: `http://localhost:${config.port}/api/health` }, "Health check");
        });
    }
    catch (err) {
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
