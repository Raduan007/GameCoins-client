const env = {
  MONGODB_URI: process.env.MONGO_DB_URI || "",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

if (!env.MONGODB_URI) {
  throw new Error("MONGO_DB_URI environment variable is not defined");
}

export default env;