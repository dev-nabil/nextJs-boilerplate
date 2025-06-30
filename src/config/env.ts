function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  // App
  APP_URL: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),

  // API
  API_URL: getEnvVar("NEXT_PUBLIC_SERVER_URL", "http://localhost:3001"),
  API_KEY: getEnvVar("NEXT_PUBLIC_API_KEY"),

  // Database
  DATABASE_URL: getEnvVar("DATABASE_URL"),

  // Auth
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  NEXTAUTH_SECRET: getEnvVar("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: getEnvVar("NEXTAUTH_URL", "http://localhost:3000"),

  // External Services
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // Feature Flags
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === "true",
  ENABLE_ERROR_REPORTING: process.env.ENABLE_ERROR_REPORTING === "true",
} as const

export const isDevelopment = env.NODE_ENV === "development"
export const isProduction = env.NODE_ENV === "production"
export const isTest = env.NODE_ENV === "test"
