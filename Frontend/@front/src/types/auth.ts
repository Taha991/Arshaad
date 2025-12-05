export interface User {
  id: number
  uuid: string
  email: string
  name: string
  role: 'guest' | 'student' | 'mentor' | 'admin'
  avatar?: string | null
  is_verified: boolean
  date_joined?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  password_confirm: string
  name?: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: {
    id: number
    uuid: string
    email: string
    name: string
    role: 'guest' | 'student' | 'mentor' | 'admin'
    is_verified: boolean
  }
}

