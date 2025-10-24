import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createTodo, deleteTodo, listTodos, updateTodo, reorderTodos, type Todo } from './api.ts'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TodoCard } from './components/TodoCard'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length
  }), [todos])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listTodos()
      setTodos(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const onCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const created = await createTodo(title.trim())
      setTodos(prev => [...prev, created])
      setTitle('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    }
  }, [title])

  const onToggle = useCallback(async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed })
      setTodos(prev => prev.map(t => t.id === todo.id ? updated : t))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update')
    }
  }, [])

  const onEdit = useCallback(async (todo: Todo, newTitle: string) => {
    try {
      const updated = await updateTodo(todo.id, { title: newTitle })
      setTodos(prev => prev.map(t => t.id === todo.id ? updated : t))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update')
    }
  }, [])

  const onDeleteTodo = useCallback(async (id: number) => {
    try {
      await deleteTodo(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
    }
  }, [])

  const onDismissError = useCallback(() => setError(''), [])

  const onReorder = useCallback(async (ids: number[]) => {
    try {
      const ordered = await reorderTodos(ids)
      setTodos(ordered)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to reorder')
    }
  }, [])

  if (loading) return <div className="container"><p>Loading…</p></div>

  return (
    <div>
      <Header onRefresh={refresh} />
      <Hero />
      <TodoCard
        todos={todos}
        title={title}
        onTitleChange={setTitle}
        onCreate={onCreate}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDeleteTodo}
        stats={stats}
        error={error}
        onDismissError={onDismissError}
        disableAdd={!title.trim()}
        onReorder={onReorder}
      />
      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} group9‑style To‑Do • Built with Spring Boot + React</div>
      </footer>
    </div>
  )
}
