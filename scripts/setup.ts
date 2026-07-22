#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = path.resolve(process.cwd());
const ENV_EXAMPLE = path.join(ROOT, ".env.example");
const ENV_LOCAL = path.join(ROOT, ".env.local");
const DATA_DIR = path.join(ROOT, "data");

function green(msg: string) { return `\x1b[32m${msg}\x1b[0m`; }
function cyan(msg: string) { return `\x1b[36m${msg}\x1b[0m`; }
function yellow(msg: string) { return `\x1b[33m${msg}\x1b[0m`; }

console.log(cyan("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(cyan("  Vibe flow — Setup do Projeto"));
console.log(cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

if (!fs.existsSync(ENV_LOCAL)) {
  if (fs.existsSync(ENV_EXAMPLE)) {
    fs.copyFileSync(ENV_EXAMPLE, ENV_LOCAL);
    console.log(green("✓ .env.local criado a partir de .env.example"));
    console.log(yellow("  → Edite .env.local com suas configurações"));
  }
} else {
  console.log(green("✓ .env.local já existe"));
}

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(green("✓ Diretório data/ criado"));
} else {
  console.log(green("✓ Diretório data/ já existe"));
}

console.log(cyan("\n── Instalando dependências ──\n"));
execSync("npm install", { stdio: "inherit", cwd: ROOT });

console.log(cyan("\n── Verificando TypeScript ──\n"));
try {
  execSync("npx tsc --noEmit", { stdio: "inherit", cwd: ROOT });
  console.log(green("\n✓ Frontend TypeScript OK"));
} catch {
  console.log(yellow("\n⚠ Frontend TypeScript com avisos"));
}

try {
  execSync("npx tsc --project tsconfig.server.json --noEmit", { stdio: "inherit", cwd: ROOT });
  console.log(green("✓ Server TypeScript OK"));
} catch {
  console.log(yellow("\n⚠ Server TypeScript com avisos"));
}

console.log(cyan("\n── Build de produção ──\n"));
execSync("npm run build", { stdio: "inherit", cwd: ROOT });
console.log(green("\n✓ Build concluído"));

console.log(cyan("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(green("  Setup concluído!"));
console.log(cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
console.log("  Para iniciar o desenvolvimento:");
console.log(`  ${yellow("npm run dev:all")}`);
console.log("\n  Credenciais de teste (SQLite):");
console.log(`  Email: ${yellow("admin@vibeflow.ai")}`);
console.log(`  Senha: ${yellow("admin123")}`);
console.log("\n  Para gerar um JWT_SECRET seguro:");
console.log(`  ${yellow("npx tsx scripts/generate-secret.ts")}\n`);
