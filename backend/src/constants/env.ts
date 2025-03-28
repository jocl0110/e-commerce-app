function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
}

export const MONGO_URI = getEnv("MONGO_URI");
export const EMAIL_PORT = getEnv("EMAIL_PORT");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const SALT = getEnv("SALT");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const PORT = getEnv("PORT");
