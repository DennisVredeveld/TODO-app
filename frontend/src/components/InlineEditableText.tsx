import React, { useEffect, useState } from 'react'

export function InlineEditableText({ text, onSave, completed }: { text: string; onSave: (newText: string) => void; completed: boolean }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(text)
  useEffect(() => setValue(text), [text])

  if (editing) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); if (value.trim()) { onSave(value.trim()); setEditing(false) } }}>
        <input className="input" value={value} onChange={e => setValue(e.target.value)} onBlur={() => setEditing(false)} autoFocus />
      </form>
    )
  }

  return (
    <span
      onDoubleClick={() => setEditing(true)}
      className={`todo-title ${completed ? 'completed' : ''}`}
      title="Double click to edit"
    >
      {text}
    </span>
  )
}
