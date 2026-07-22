import { resolve } from "path";

process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.JWT_SECRET = "test-secret-do-not-use-in-production";
process.env.DB_TYPE = "sqlite";

const testDbPath = resolve(process.cwd(), "data/test/vibeflow-test.db");
process.env.DB_PATH = testDbPath;
