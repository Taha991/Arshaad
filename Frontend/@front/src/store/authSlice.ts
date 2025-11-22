import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User, LoginRequest, LoginResponse } from '../types/api'
import { loginApi, logoutApi } from '../services/authService'

type AuthState = {
  user: User | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null
}

export const login = createAsyncThunk<LoginResponse, LoginRequest>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return await loginApi(payload)
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const logout = createAsyncThunk<void>('auth/logout', async () => {
  await logoutApi()
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Login failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = 'idle'
      })
  }
})

export const { setUser } = slice.actions
export default slice.reducer