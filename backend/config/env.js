// Centralized environment normalization for production and CI/CD.
// Supports legacy variable names plus the provided test env names.

const assignAlias = (target, sources) => {
  if (process.env[target]) return;
  for (const source of sources) {
    if (process.env[source]) {
      process.env[target] = process.env[source];
      return;
    }
  }
};

assignAlias("DB_URL", ["MONGO_URI", "MONGODB_URI"]);
assignAlias("JWT_KEY", ["JWT_SECRET", "SESSION_SECRET"]);
assignAlias("CLOUDINARY_CLOUD_NAME", ["CLOUDINARY_NAME"]);
assignAlias("SMTP_USER", ["SMTP_MAIL", "MAIL_USER"]);
assignAlias("SMTP_PASS", ["SMTP_PASSWORD", "MAIL_PASS"]);
assignAlias("SMTP_HOST", ["MAIL_HOST"]);
assignAlias("SMTP_FROM", ["MAIL_FROM"]);
assignAlias("CLIENT_URL", ["FRONTEND_URL", "WEB_URL"]);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  dbUrl: process.env.DB_URL,
  jwtKey: process.env.JWT_KEY,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  allowedOrigins: (process.env.CORS_ORIGINS || process.env.CLIENT_URL || "http://localhost:3000,http://127.0.0.1:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

const required = ["DB_URL", "JWT_KEY"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.warn(`[env] Missing required environment variable(s): ${missing.join(", ")}`);
}
