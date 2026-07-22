#!/usr/bin/env node
import { config } from "../server/config";
import { getDb, closeDb } from "../server/db";

async function main() {
  console.log("\n  ── Populando banco de dados com dados de demonstração ──\n");

  const db = await getDb();
  console.log("  ✓ Banco conectado");

  try {
    // Force re-seed by re-initializing
    await db.init();
    console.log("  ✓ Dados de demonstração inseridos (se banco estava vazio)");
    console.log("\n  ──────────────────────────────────────────────");
    console.log("  Credenciais de teste:");
    console.log(`  Email: admin@vibeflow.ai`);
    console.log(`  Senha: admin123`);
    console.log("  ──────────────────────────────────────────────\n");
  } finally {
    await closeDb();
  }
}

main().catch(console.error);
