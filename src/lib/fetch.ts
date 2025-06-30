// import type { APIResponse, FetchOptions } from '@/types/fetch'

// export default async function fetchData(path: string, options?: FetchOptions): Promise<APIResponse> {
//   const base = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || ''
//   const apiKey = process.env.NEXT_PUBLIC_API_KEY || process.env.NEXT_PUBLIC_API_KEY || ''

//   const headers: HeadersInit = {
//     'x-api-key': apiKey,
//     Authorization: options?.token ? `Bearer ${options?.token}` : '',
//     ...options?.customHeaders
//   }

//   let body: BodyInit | undefined = undefined

//   if (options?.formData) {
//     const formData = options.formData

//     if (options?.multipart) {
//       body = new FormData()

//       for (const key in formData) {
//         if (Array.isArray(formData[key])) {
//           // For array fields
//           formData[key].forEach((file: Blob) => {
//             if (body instanceof FormData) {
//               body.append(key, file)
//             }
//           })
//         } else {
//           // For non-array fields
//           body.append(key, formData[key] as string | Blob)
//         }
//       }
//     } else {
//       body = JSON.stringify(options.formData)
//       headers['Content-Type'] = 'application/json'
//     }
//   }

//   try {
//     const response = await fetch(`${base}${path}`, {
//       method: options?.method || 'GET',
//       headers,
//       body,
//       credentials: 'include',
//       next: { revalidate: options?.revalidate || 0 }
//     })

//     return await response.json()
//   } catch (error) {
//     console.error(error)
//     return { status: 'ERROR', message: 'Something went wrong' }
//   }
// }

export type APIResponse = {
  status: 'SUCCESS' | 'ERROR'
  status_code?: number
  data?: unknown
  message?: string
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  cache?: 'no-store' | 'force-cache' | 'only-if-cached'
  'x-api-key'?: string
  data?: Record<string, any> | null
  exHeader?: Record<string, string>
  tags?: string[]
  revalidate?: number
}
// const cookieStore = await cookies()
// cookie: cookieStore.toString(), // this is for server side cookies use header for client side cookies

export default async function fetchData(path: string, options?: FetchOptions): Promise<APIResponse> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || ''
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
  const nextOptions: Record<string, any> = {}
  if (options?.tags) nextOptions.tags = options.tags
  if (typeof options?.revalidate === 'number') nextOptions.revalidate = options.revalidate
  const isRevalidate = Object.keys(nextOptions).length > 0
  try {
    const res = await fetch(`${base}${path}`, {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': options?.['x-api-key'] || apiKey,

        ...options?.exHeader
      },
      credentials: 'include',
      ...(isRevalidate
        ? {
            cache: 'force-cache',
            next: nextOptions
          }
        : {
            cache: options?.cache || 'no-store'
          }),
      body: options?.data ? JSON.stringify(options.data) : undefined
    })

    const data = await res.json()
    return {
      status: res.ok ? 'SUCCESS' : 'ERROR',
      status_code: res.status,
      data,
      message: res.ok ? 'Request successful' : data.message || 'Request failed'
    }
  } catch (error: any) {
    console.error(error)
    return {
      status: 'ERROR',
      message: 'Something went wrong',
      status_code: 500,
      data: null
    }
  }
}
