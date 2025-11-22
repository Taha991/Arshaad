import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { Landing } from '../pages/Landing'

test('renders landing sections', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    </Provider>
  )
  expect(screen.getByText(/Find your path/i)).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /About Us/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /Who We Are/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /See Market/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /Our Roadmaps/i })).toBeInTheDocument()
})