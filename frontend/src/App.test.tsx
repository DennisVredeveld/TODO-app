import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import * as api from './api.ts'

vi.mock('./api.ts', () => ({
  listTodos: vi.fn(async () => [{ id: 1, title: 'Buy milk', completed: false }]),
  createTodo: vi.fn(async (title: string) => ({ id: 2, title, completed: false })),
  updateTodo: vi.fn(async (id: number, data: Partial<{ title: string; completed: boolean }>) => ({ id, title: (data as any).title ?? 'Buy milk', completed: (data as any).completed ?? false })),
  deleteTodo: vi.fn(async () => undefined)
}))

describe('App', () => {
  it('renders list and allows creating a todo', async () => {
    render(<App />)

    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument())

    expect(screen.getByText('Buy milk')).toBeInTheDocument()

    const input = screen.getByLabelText(/New task title/i)
    fireEvent.change(input, { target: { value: 'Walk dog' } })
    fireEvent.submit(screen.getByRole('form', { name: /create-form/i }))

    await waitFor(() => expect((api.createTodo as any)).toHaveBeenCalled())
    expect(screen.getByText('Walk dog')).toBeInTheDocument()
  })

  it('toggles completion', async () => {
    render(<App />)
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument())

    const checkbox = screen.getByRole('checkbox', { name: /toggle buy milk/i }) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
    fireEvent.click(checkbox)

    await waitFor(() => expect((api.updateTodo as any)).toHaveBeenCalled())
  })
})
