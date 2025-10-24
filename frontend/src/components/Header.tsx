import React from 'react'

export function Header({ onRefresh }: { onRefresh: () => void }) {
  return (
    <header className="header">
      <div className="container nav">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true" />
          <div className="brand-title">group9 • To-Do</div>
        </div>
        <div className="nav-cta">
          <a className="button" href="/api/todos" target="_blank" rel="noreferrer">API</a>
          <button className="button accent" title="Refresh list" onClick={onRefresh}>Refresh</button>
        </div>
      </div>
    </header>
  )
}
