export default function generateURLParams(searchParams: URLSearchParams, params: Record<string, string | null>) {
  const newSearchParams = new URLSearchParams(searchParams)

  // Set or remove additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      newSearchParams.delete(key)
    } else {
      newSearchParams.set(key, value)
    }
  })

  return newSearchParams.toString()
}
