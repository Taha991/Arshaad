import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { Login } from '../pages/Login'

test('login form renders and accepts input', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  )
  const email = screen.getByLabelText(/Email/i) as HTMLInputElement
  const pwd = screen.getByLabelText(/Password/i) as HTMLInputElement

  fireEvent.change(email, { target: { value: 'test@example.com' } })
  fireEvent.change(pwd, { target: { value: 'password123' } })

  expect(email.value).toBe('test@example.com')
  expect(pwd.value).toBe('password123')
})