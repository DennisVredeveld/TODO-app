import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./api.ts', () => ({
  listTodos: vi.fn(async () => [
    { id: 1, title: 'Buy milk', completed: false },
    { id: 2, title: 'Walk dog', completed: false }
  ]),
  createTodo: vi.fn(async (title: string) => ({ id: 3, title, completed: false })),
  updateTodo: vi.fn(async (id: number, data: Partial<{ title: string; completed: boolean }>) => ({ id, title: (data as any).title ?? 'x', completed: (data as any).completed ?? false })),
  deleteTodo: vi.fn(async () => undefined)
}))

import * as api from './api.ts'

describe('App delete todo', () => {
  it('deletes a todo item', async () => {
    render(<App />)
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument())

    // Ensure initial todos present
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText('Walk dog')).toBeInTheDocument()

    // Click delete on first todo
    const deleteBtn = screen.getByRole('button', { name: /delete buy milk/i })
    fireEvent.click(deleteBtn)

    await waitFor(() => expect((api.deleteTodo as any)).toHaveBeenCalled())
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
  })
})
