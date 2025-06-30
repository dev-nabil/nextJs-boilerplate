export const APP_NAME = "Next.js Boilerplate"
export const APP_DESCRIPTION = "A modern Next.js boilerplate with TypeScript and Tailwind CSS"

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  SETTINGS: "/dashboard/settings",
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
  },
  USERS: {
    LIST: "/api/users",
    CREATE: "/api/users",
    UPDATE: "/api/users",
    DELETE: "/api/users",
  },
} as const
