let accessToken: string | null = null
let refreshToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
  if (token) localStorage.setItem('accessToken', token)
  else localStorage.removeItem('accessToken')
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken
  const stored = localStorage.getItem('accessToken')
  accessToken = stored || null
  return accessToken
}

export function setRefreshToken(token: string | null) {
  refreshToken = token
  if (token) localStorage.setItem('refreshToken', token)
  else localStorage.removeItem('refreshToken')
}

export function getRefreshToken(): string | null {
  if (refreshToken) return refreshToken
  const stored = localStorage.getItem('refreshToken')
  refreshToken = stored || null
  return refreshToken
}

export function clearTokens() {
  setAccessToken(null)
  setRefreshToken(null)
}