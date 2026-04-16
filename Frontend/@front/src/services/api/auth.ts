import axios from 'axios'
import { LoginCredentials, RegisterData, User, AuthResponse } from '../../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
        const isLocal = !!localStorage.getItem('refresh_token')
        const storage = isLocal ? localStorage : sessionStorage
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          })
          const { access } = response.data
          storage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Use real API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login/', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout/')
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/user/')
    return response.data
  },

  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await api.post<{ access: string }>('/auth/refresh/', { refresh })
    return response.data
  },

  forgotPassword: async (email: string): Promise<{ detail: string }> => {
    const response = await api.post<{ detail: string }>('/auth/reset-password/', { email })
    return response.data
  },

  verifyEmail: async (token: string): Promise<{ detail: string }> => {
    const response = await api.post<{ detail: string }>('/auth/verify-email/', { token })
    return response.data
  },

  resetPassword: async (token: string, password: string, password_confirm: string): Promise<{ detail: string }> => {
    const response = await api.post<{ detail: string }>('/auth/reset-password/confirm/', { 
      token, 
      password,
      password_confirm
    })
    return response.data
  },
}

export default api

