import reducer, { setUser } from '../store/authSlice'

test('setUser updates state', () => {
  const initial = { user: null, status: 'idle', error: null } as any
  const user = { id: '1', name: 'User', email: 'u@example.com' }
  const state = reducer(initial, setUser(user))
  expect(state.user).toEqual(user)
})