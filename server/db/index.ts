import { config } from "../config";
import type { DatabaseAdapter } from "./adapter";

let adapter: DatabaseAdapter | null = null;

export async function getDb(): Promise<DatabaseAdapter> {
  if (adapter) return adapter;

  switch (config.db_type) {
    case "supabase": {
      const { SupabaseAdapter } = await import("./adapters/supabase");
      adapter = new SupabaseAdapter();
      break;
    }
    case "firebase": {
      const { FirebaseAdapter } = await import("./adapters/firebase");
      adapter = new FirebaseAdapter();
      break;
    }
    default: {
      const { SqliteAdapter } = await import("./adapters/sqlite");
      adapter = new SqliteAdapter(config.db_path);
    }
  }

  if (!adapter) throw new Error("No database adapter configured. Check DB_TYPE in .env");
  await adapter.init();
  return adapter;
}

export async function closeDb(): Promise<void> {
  if (adapter) {
    await adapter.close();
    adapter = null;
  }
}
