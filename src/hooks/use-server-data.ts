"use client"

import { useEffect, useState } from "react"
import { clientFetch } from "@/lib/client-fetch"

interface UseServerDataOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  refetchInterval?: number
}

export function useServerData<T>(endpoint: string, options: UseServerDataOptions = {}) {
  const { enabled = true, refetchOnWindowFocus = false, refetchInterval } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const response = await clientFetch<T>(endpoint)

      if (response.status === "SUCCESS") {
        setData(response.data || null)
      } else {
        setError(response.message || "Failed to fetch data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint, enabled])

  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(fetchData, refetchInterval)
      return () => clearInterval(interval)
    }
  }, [refetchInterval, enabled])

  useEffect(() => {
    if (refetchOnWindowFocus && enabled) {
      const handleFocus = () => fetchData()
      window.addEventListener("focus", handleFocus)
      return () => window.removeEventListener("focus", handleFocus)
    }
  }, [refetchOnWindowFocus, enabled])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
