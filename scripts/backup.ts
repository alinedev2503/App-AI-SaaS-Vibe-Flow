#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DATA_DIR = path.resolve(process.cwd(), "data");
const BACKUP_DIR = path.resolve(process.cwd(), "data/backups");
const DB_PATH = path.join(DATA_DIR, "vibeflow.db");

function green(msg: string) { return `\x1b[32m${msg}\x1b[0m`; }
function red(msg: string) { return `\x1b[31m${msg}\x1b[0m`; }

if (!fs.existsSync(DB_PATH)) {
  console.log(red(`Nenhum banco de dados encontrado em ${DB_PATH}`));
  process.exit(1);
}

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = path.join(BACKUP_DIR, `vibeflow-${timestamp}.db`);

try {
  execSync(`cp "${DB_PATH}" "${backupPath}"`);
  const stats = fs.statSync(backupPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(green(`✓ Backup criado: ${backupPath}`));
  console.log(green(`  Tamanho: ${sizeKB} KB`));

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith("vibeflow-"))
    .sort()
    .reverse();

  if (backups.length > 10) {
    const toRemove = backups.slice(10);
    for (const f of toRemove) {
      fs.unlinkSync(path.join(BACKUP_DIR, f));
    }
    console.log(`  Removidos ${toRemove.length} backups antigos (máx 10 mantidos)`);
  }
} catch (err) {
  console.error(red("Erro ao criar backup:"), err);
  process.exit(1);
}
