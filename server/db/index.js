import { config } from "../config";
let adapter = null;
export async function getDb() {
    if (adapter)
        return adapter;
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
    await adapter.init();
    return adapter;
}
export async function closeDb() {
    if (adapter) {
        await adapter.close();
        adapter = null;
    }
}
