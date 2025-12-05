import axios from 'axios'
import { AuthResponse } from '../../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const oauthAPI = {
  // Get the OAuth URL for Google
  getGoogleAuthUrl: (): string => {
    return `${API_BASE_URL}/auth/oauth/google/`
  },

  // Handle OAuth callback - exchange code for tokens
  handleOAuthCallback: async (code: string, provider: string = 'google'): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/oauth/${provider}/callback/`,
      { code }
    )
    return response.data
  },

  // Alternative: Direct token exchange if using access_token
  exchangeToken: async (accessToken: string, provider: string = 'google'): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/oauth/${provider}/`,
      { access_token: accessToken }
    )
    return response.data
  },
}

