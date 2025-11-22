import { api } from './apiClient'
import type { LoginRequest, LoginResponse } from '../types/api'

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function logoutApi(): Promise<void> {
  await api.post('/auth/logout')
}

export async function refreshApi(): Promise<void> {
  await api.post('/auth/refresh')
}