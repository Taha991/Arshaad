import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api/auth'
import { LoginCredentials, RegisterData, User, AuthTokens, AuthResponse } from '../../types/auth'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Load tokens from localStorage or sessionStorage on init
const loadTokens = (): AuthTokens | null => {
  const access = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  const refresh = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
  if (access && refresh) {
    return { access, refresh }
  }
  return null
}

// Initialize state from storage
const savedTokens = loadTokens()
if (savedTokens) {
  initialState.tokens = savedTokens
  initialState.isAuthenticated = true
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials & { rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      const { rememberMe, ...restCredentials } = credentials
      const response = await authAPI.login(restCredentials)
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('access_token', response.access)
      storage.setItem('refresh_token', response.refresh)
      if (rememberMe) {
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
      } else {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data)
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('refresh_token')
})

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authAPI.getCurrentUser()
      return user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to get user')
    }
  }
)

export const oauthLogin = createAsyncThunk(
  'auth/oauthLogin',
  async (payload: { authResponse: AuthResponse; rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      const { authResponse, rememberMe } = payload
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('access_token', authResponse.access)
      storage.setItem('refresh_token', authResponse.refresh)
      if (rememberMe) {
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
      } else {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
      return authResponse
    } catch (error: any) {
      return rejectWithValue('OAuth login failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.tokens = { access: action.payload.access, refresh: action.payload.refresh }
        state.user = action.payload.user as User
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.tokens = { access: action.payload.access, refresh: action.payload.refresh }
        state.user = action.payload.user as User
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
    })

    // Get current user
    builder
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
      })

    // OAuth login
    builder
      .addCase(oauthLogin.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(oauthLogin.fulfilled, (state, action) => {
        state.isLoading = false
        state.tokens = { access: action.payload.access, refresh: action.payload.refresh }
        state.user = action.payload.user as User
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(oauthLogin.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

