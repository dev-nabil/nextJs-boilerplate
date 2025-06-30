export enum UserRole {
  ADMIN = "admin",
  BUYER = "buyer",
  SELLER = "seller",
  USER = "user",
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  verified: boolean
  provider?: "google" | "credentials"
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  provider?: "credentials" | "google"
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  provider?: "google" | "credentials"
  avatar?: string
}

export interface AuthResponse {
  user: User
  message: string
}

export type Session = {
  name: string
  role: string
  email?: string
} | null

export type Auth = {
  session: Session
  login: (formData: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (formData: RegisterData) => Promise<void>
}
