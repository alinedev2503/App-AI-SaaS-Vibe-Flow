import type { DatabaseAdapter } from "./adapter";
export declare function getDb(): Promise<DatabaseAdapter>;
export declare function closeDb(): Promise<void>;
