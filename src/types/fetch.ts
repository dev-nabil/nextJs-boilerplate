export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  token?: string
  formData?: Record<string, string | number | File>
  multipart?: boolean
  customHeaders?: Record<string, string>
  revalidate?: number
  headers?: HeadersInit
}

export type APIResponse = {
  status: 'SUCCESS' | 'ERROR'
  status_code?: number
  data?: unknown
  message?: string
}
