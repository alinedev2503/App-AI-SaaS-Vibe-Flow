import path from "path";

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  jwt_secret: process.env.JWT_SECRET || "vibeflow-dev-secret-change-in-production",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  db_type: process.env.DB_TYPE || "sqlite",
  db_path: process.env.DB_PATH || path.resolve(process.cwd(), "data/vibeflow.db"),
  gemini_api_key: process.env.GEMINI_API_KEY || "",
  app_url: process.env.APP_URL || "http://localhost:3000",

  supabase_url: process.env.SUPABASE_URL || "",
  supabase_anon_key: process.env.SUPABASE_ANON_KEY || "",
  supabase_service_key: process.env.SUPABASE_SERVICE_KEY || "",

  firebase_project_id: process.env.FIREBASE_PROJECT_ID || "",
  firebase_client_email: process.env.FIREBASE_CLIENT_EMAIL || "",
  firebase_private_key: process.env.FIREBASE_PRIVATE_KEY || "",
  firebase_database_url: process.env.FIREBASE_DATABASE_URL || "",
  firebase_fcm_server_key: process.env.FIREBASE_FCM_SERVER_KEY || "",
};
