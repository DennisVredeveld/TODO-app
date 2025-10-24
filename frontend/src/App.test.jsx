import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App.jsx'

// Mock API module
vi.mock('./api.js', () => ({
  listTodos: vi.fn(async () => [{ id: 1, title: 'Buy milk', completed: false }]),
  createTodo: vi.fn(async (title) => ({ id: 2, title, completed: false })),
  updateTodo: vi.fn(async (id, data) => ({ id, title: data.title ?? 'Buy milk', completed: data.completed ?? false })),
  deleteTodo: vi.fn(async () => undefined)
}))

import * as api from './api.js'

describe('App', () => {
  it('renders list and allows creating a todo', async () => {
    render(<App />)

    // initial loading state disappears
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument())

    // existing item
    expect(screen.getByText('Buy milk')).toBeInTheDocument()

    // create
    const input = screen.getByLabelText(/New task title/i)
    fireEvent.change(input, { target: { value: 'Walk dog' } })
    fireEvent.submit(screen.getByRole('form', { name: /create-form/i }))

    await waitFor(() => expect(api.createTodo).toHaveBeenCalled())
    expect(screen.getByText('Walk dog')).toBeInTheDocument()
  })

  it('toggles completion', async () => {
    render(<App />)
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument())
    const checkbox = screen.getByRole('checkbox', { name: /toggle buy milk/i })
    fireEvent.click(checkbox)
    await waitFor(() => expect(api.updateTodo).toHaveBeenCalled())
  })
})
