import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SqliteAdapter } from "../server/db/adapters/sqlite";
import { SupabaseAdapter } from "../server/db/adapters/supabase";
import { FirebaseAdapter } from "../server/db/adapters/firebase";
import fs from "fs";
import path from "path";

const TEST_DB_PATH = path.resolve("./data/test_vibeflow.db");

describe("Database Adapters Integrity Test", () => {
  let sqlite: SqliteAdapter;

  beforeEach(async () => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    sqlite = new SqliteAdapter(TEST_DB_PATH);
    await sqlite.init();
  });

  afterEach(async () => {
    await sqlite.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  it("SQLite Adapter initializes seed data and authenticates user", async () => {
    const user = await sqlite.findUserByEmail("admin@vibeflow.ai");
    expect(user).not.toBeNull();
    expect(user?.name).toBe("Alex Rivera");
    expect(user?.role).toBe("admin");
  });

  it("SQLite Adapter creates and lists agents", async () => {
    const user = await sqlite.findUserByEmail("admin@vibeflow.ai");
    const agents = await sqlite.listAgents(user!.id);
    expect(agents.length).toBeGreaterThan(0);

    const newAgent = await sqlite.createAgent({
      user_id: user!.id,
      name: "Agente de Teste QA",
      role: "Automação e QA",
      status: "Online",
      icon: "Shield",
      icon_color: "text-primary",
      icon_bg: "bg-primary/10",
      memory_usage: "4k",
      memory_total: "128k",
      memory_percent: 3,
      capabilities: ["FileText", "Check"],
      objective: "Testar o sistema continuamente",
    });

    expect(newAgent.id).toBeDefined();
    expect(newAgent.name).toBe("Agente de Teste QA");
  });

  it("Supabase Adapter initializes gracefully without throwing", async () => {
    const supabase = new SupabaseAdapter();
    await supabase.init();
    const user = await supabase.findUserByEmail("admin@vibeflow.ai");
    expect(user).not.toBeNull();
  });

  it("Firebase Adapter initializes gracefully without throwing", async () => {
    const firebase = new FirebaseAdapter();
    await firebase.init();
    const user = await firebase.findUserByEmail("admin@vibeflow.ai");
    expect(user).not.toBeNull();
  });
});
