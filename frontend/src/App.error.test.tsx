import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./api.ts', () => ({
  listTodos: vi.fn(async () => { throw new Error('Boom') }),
  createTodo: vi.fn(async () => { throw new Error('create failed') }),
  updateTodo: vi.fn(async () => { throw new Error('update failed') }),
  deleteTodo: vi.fn(async () => { throw new Error('delete failed') })
}))

describe('App error states', () => {
  it('shows an error alert when list fails', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })
})
