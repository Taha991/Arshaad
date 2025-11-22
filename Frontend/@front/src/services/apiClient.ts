import axios from 'axios'
import { getAccessToken, setAccessToken } from './tokenService'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: { resolve: (token: string | null) => void }[] = []

function processQueue(token: string | null) {
  pendingQueue.forEach((p) => p.resolve(token))
  pendingQueue = []
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    const status = error?.response?.status
    const message = error?.response?.data?.message || error.message || 'Unexpected error'
    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        const token = await new Promise<string | null>((resolve) => pendingQueue.push({ resolve }))
        if (token) {
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${token}` }
        }
        original._retry = true
        return api(original)
      }
      isRefreshing = true
      original._retry = true
      try {
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh/')
        setAccessToken(data.accessToken)
        processQueue(data.accessToken)
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${data.accessToken}` }
        return api(original)
      } catch (e) {
        processQueue(null)
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(new Error(message))
  }
)