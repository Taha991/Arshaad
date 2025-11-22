import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Unexpected error'
    return Promise.reject(new Error(message))
  }
)