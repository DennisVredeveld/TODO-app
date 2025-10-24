import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./api.ts', () => ({
  listTodos: vi.fn(async () => [{ id: 1, title: 'Buy milk', completed: false }]),
  createTodo: vi.fn(async (title: string) => ({ id: 2, title, completed: false })),
  updateTodo: vi.fn(async (id: number, data: Partial<{ title: string; completed: boolean }>) => ({ id, title: (data as any).title ?? 'Buy milk', completed: (data as any).completed ?? false })),
  deleteTodo: vi.fn(async () => undefined)
}))

import * as api from './api.ts'

describe('App edit title', () => {
  it('edits a todo title on double-click', async () => {
    render(<App />)
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument())

    const titleEl = screen.getByText('Buy milk')
    fireEvent.doubleClick(titleEl)

    const editInput = screen.getByDisplayValue('Buy milk') as HTMLInputElement
    fireEvent.change(editInput, { target: { value: 'Buy oat milk' } })
    fireEvent.submit(editInput.closest('form')!)

    await waitFor(() => expect((api.updateTodo as any)).toHaveBeenCalled())
    expect(screen.getByText('Buy oat milk')).toBeInTheDocument()
  })
})
