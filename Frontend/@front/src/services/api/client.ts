import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://arshaad.onrender.com/api'

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: attach token ─────────────────────────────────────────
client.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response: auto-refresh on 401 ────────────────────────────────
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh =
          localStorage.getItem('refresh_token') ||
          sessionStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')

        const isLocal = !!localStorage.getItem('refresh_token')
        const storage = isLocal ? localStorage : sessionStorage

        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, {
          refresh,
        })
        storage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return client(original)
      } catch {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
