import React from 'react'

export function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Lead. Don’t follow.</h1>
        <p>Elite • Java • Development — A polished To‑Do with Spring Boot + React.</p>
        <div className="hero-kickers">
          <span className="kicker">Fast REST API</span>
          <span className="kicker">In‑memory store</span>
          <span className="kicker">Accessible UI</span>
        </div>
        <div className="pillars">
          <div className="pillar">
            <h3>Elite.</h3>
            <p>Clean structure, tests, and consistent API behavior.</p>
          </div>
          <div className="pillar">
            <h3>Java.</h3>
            <p>Spring Boot backend with simple, readable code.</p>
          </div>
          <div className="pillar">
            <h3>Development.</h3>
            <p>React + Vite frontend with a modern, responsive UI.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
