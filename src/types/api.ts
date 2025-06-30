export interface APIResponse<T = any> {
  status: "SUCCESS" | "ERROR"
  status_code: number
  message: string
  data: T | null
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ServerFetchOptions extends RequestInit {
  cache?: RequestCache | "force-cache" | "no-store"
  revalidate?: number | false
  tags?: string[]
  timeout?: number
  cookies?: string
  userAgent?: string
}

export interface TableData {
  id: string | number
  [key: string]: any
}

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface SortOption {
  label: string
  value: string
  direction: "asc" | "desc"
}
