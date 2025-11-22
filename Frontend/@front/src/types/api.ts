export type User = {
  id: string
  name: string
  email: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  user: User
  accessToken?: string
  refreshToken?: string
}

export type RefreshResponse = {
  accessToken: string
}

export type OAuthLoginRequest = {
  provider: 'google'
  idToken: string
}