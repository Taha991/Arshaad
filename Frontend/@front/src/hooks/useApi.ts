import { useState, useEffect, useCallback, useRef } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Generic hook to call any async API function.
 *
 * Usage:
 *   const { data, loading, error } = useApi(() => roadmapsAPI.myRoadmap())
 *
 * Pass deps[] to re-run when something changes:
 *   const { data } = useApi(() => eventsAPI.list({ category }), [category])
 */
export function useApi<T>(
  fn: () => Promise<T>,
  deps: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const counter = useRef(0)

  const fetch = useCallback(async () => {
    const id = ++counter.current
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      if (id === counter.current) setData(result)
    } catch (e: any) {
      if (id === counter.current)
        setError(
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          e?.message ||
          'Something went wrong'
        )
    } finally {
      if (id === counter.current) setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}
