import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SqliteAdapter } from "../server/db/adapters/sqlite";
import fs from "fs";
import path from "path";

const TEST_DB_PATH = path.resolve("./data/test_auth_vibeflow.db");

describe("Authentication & Security Contract Tests", () => {
  let db: SqliteAdapter;

  beforeEach(async () => {
    if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
    db = new SqliteAdapter(TEST_DB_PATH);
    await db.init();
  });

  afterEach(async () => {
    await db.close();
    if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
  });

  it("hashes password with salt and prevents plain-text storage", async () => {
    const user = await db.createUser({
      email: "secure@vibeflow.ai",
      name: "Security User",
      password: "SuperSecretPassword123!",
      role: "operator",
    });

    expect(user.id).toBeDefined();
    const fetched = await db.findUserByEmail("secure@vibeflow.ai");
    expect(fetched).not.toBeNull();
    expect(fetched?.password).not.toBe("SuperSecretPassword123!");
    expect(fetched?.password).toContain(":");
  });

  it("creates, finds and revokes user sessions", async () => {
    const user = await db.findUserByEmail("admin@vibeflow.ai");
    const token = "test_token_123456789";
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    const session = await db.createSession({
      user_id: user!.id,
      token,
      expires_at: expiresAt,
    });

    expect(session.token).toBe(token);

    const found = await db.findSessionByToken(token);
    expect(found).not.toBeNull();
    expect(found?.user_id).toBe(user!.id);

    await db.deleteSession(token);
    const afterDelete = await db.findSessionByToken(token);
    expect(afterDelete).toBeNull();
  });

  it("creates audit logs for security events", async () => {
    const user = await db.findUserByEmail("admin@vibeflow.ai");
    const log = await db.createAuditLog({
      user_id: user!.id,
      event_id: "EVT-TEST-001",
      actor: user!.name,
      actor_type: "user",
      action: "Test Security Event Log",
      status: "success",
    });

    expect(log.id).toBeDefined();
    const { logs } = await db.listAuditLogs({ userId: user!.id });
    expect(logs.some(l => l.event_id === "EVT-TEST-001")).toBe(true);
  });
});
