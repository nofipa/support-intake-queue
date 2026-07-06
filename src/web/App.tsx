import { useEffect, useState } from 'react'

const API = 'http://localhost:3000'

type Ticket = {
  id: number
  category: string
  description: string
  affected_scope: string
  priority: string
  assigned_to: string
  sla_minutes: number
  status: string
}

// Naive intake form matching the naive backend (ready-made fields).
// TASK: turn this into a real chat where the bot asks its own follow-ups (see README).
export function App() {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [affectedScope, setAffectedScope] = useState('me')
  const [message, setMessage] = useState('')
  const [tickets, setTickets] = useState<Ticket[]>([])

  async function loadTickets() {
    const res = await fetch(`${API}/tickets`)
    setTickets(await res.json())
  }
  useEffect(() => {
    loadTickets()
  }, [])

  async function submit() {
    const res = await fetch(`${API}/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gathered: { category, description, affectedScope } }),
    })
    const data = await res.json()
    if (data.status === 'need_more') setMessage(`Bot: ${data.question}`)
    else {
      setMessage(`Ticket #${data.ticket.id} created (${data.ticket.priority}, ${data.ticket.assigned_to})`)
      loadTickets()
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '2rem auto' }}>
      <h1>Support intake</h1>
      <div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input placeholder="category (e.g. printer)" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <select value={affectedScope} onChange={(e) => setAffectedScope(e.target.value)}>
          <option value="me">affects only me</option>
          <option value="team">affects my team</option>
          <option value="all">affects everyone</option>
        </select>
        <button onClick={submit}>Send</button>
      </div>
      {message && <p>{message}</p>}

      <h2>Queue</h2>
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            #{t.id} [{t.priority}] {t.category}: {t.description} - {t.assigned_to} (SLA {t.sla_minutes}m)
          </li>
        ))}
      </ul>
    </main>
  )
}
