import { api } from './apiClient'
import type { LoginRequest, LoginResponse, RefreshResponse, User } from '../types/api'

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login/', payload)
  return data
}

export async function logoutApi(): Promise<void> {
  await api.post('/auth/logout/')
}

export async function refreshApi(): Promise<RefreshResponse> {
  const { data } = await api.post<RefreshResponse>('/auth/refresh/')
  return data
}

export async function meApi(): Promise<User> {
  const { data } = await api.get<User>('/auth/user/')
  return data
}

export async function oauthLoginApi(provider: 'google', idToken: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/oauth/', { provider, id_token: idToken })
  return data
}