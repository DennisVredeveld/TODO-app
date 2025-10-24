export type Todo = { id: number; title: string; completed: boolean; order?: number };
import { request } from './lib/http'
const API_BASE = (import.meta as any).env?.VITE_API_BASE || ''
const BASE = `${API_BASE}/api/todos`

export async function listTodos(): Promise<Todo[]> {
  return request<Todo[]>(BASE)
}

export async function createTodo(title: string): Promise<Todo> {
  return request<Todo>(BASE, { method: 'POST', body: JSON.stringify({ title }) })
}

export async function updateTodo(
  id: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>
): Promise<Todo> {
  return request<Todo>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteTodo(id: number): Promise<void> {
  await request<void>(`${BASE}/${id}`, { method: 'DELETE' })
}

export async function reorderTodos(ids: number[]): Promise<Todo[]> {
  return request<Todo[]>(`${BASE}/reorder`, {
    method: 'PUT',
    body: JSON.stringify(ids)
  })
}
