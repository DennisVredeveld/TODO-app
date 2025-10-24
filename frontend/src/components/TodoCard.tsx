import React, { useRef } from 'react'
import type { Todo } from '../api'
import { InlineEditableText } from './InlineEditableText'

export function TodoCard({
  todos,
  title,
  onTitleChange,
  onCreate,
  onToggle,
  onEdit,
  onDelete,
  stats,
  error,
  onDismissError,
  disableAdd,
  onReorder
}: {
  todos: Todo[]
  title: string
  onTitleChange: (v: string) => void
  onCreate: (e: React.FormEvent) => void
  onToggle: (todo: Todo) => void
  onEdit: (todo: Todo, title: string) => void
  onDelete: (id: number) => void
  stats: { total: number; completed: number }
  error: string
  onDismissError: () => void
  disableAdd: boolean
  onReorder: (ids: number[]) => void
}) {
  const dragFrom = useRef<number | null>(null)

  function handleDragStart(index: number) {
    dragFrom.current = index
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(toIndex: number) {
    const fromIndex = dragFrom.current
    dragFrom.current = null
    if (fromIndex == null || fromIndex === toIndex) return
    const ids = todos.map(t => t.id)
    const [moved] = ids.splice(fromIndex, 1)
    ids.splice(toIndex, 0, moved)
    onReorder(ids)
  }

  return (
    <main className="container main">
      <div className="card">
        <h2 className="section-title">Your Tasks</h2>

        {error && (
          <div role="alert" aria-live="polite" className="muted" style={{ color: 'var(--danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button className="icon-btn" onClick={onDismissError} aria-label="Dismiss error">Dismiss</button>
          </div>
        )}

        <form onSubmit={onCreate} aria-label="create-form" className="row" style={{ gap: 10 }}>
          <input
            className="input"
            placeholder="Add a task..."
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            aria-label="New task title"
          />
          <button className="button accent" type="submit" disabled={disableAdd}>Add</button>
        </form>

        <p className="muted" style={{ marginTop: 10 }}>Total: {stats.total} • Completed: {stats.completed}</p>

        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li
              key={todo.id}
              className="todo-item"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo)}
                aria-label={`Toggle ${todo.title}`}
              />
              <InlineEditableText
                text={todo.title}
                onSave={(t) => onEdit(todo, t)}
                completed={todo.completed}
              />
              <button className="icon-btn" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
