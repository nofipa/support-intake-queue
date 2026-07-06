import { DatabaseSync } from 'node:sqlite'

// Zero-dep, embedded SQLite (Node 24). support.db is created automatically.
export const db = new DatabaseSync('support.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    affected_scope TEXT NOT NULL,
    priority TEXT NOT NULL,
    assigned_to TEXT NOT NULL,
    sla_minutes INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    created_at TEXT NOT NULL
  )
`)

// Seed a couple of tickets on first run so the queue isn't empty.
const { n } = db.prepare('SELECT COUNT(*) AS n FROM tickets').get() as { n: number }
if (n === 0) {
  const insert = db.prepare(
    `INSERT INTO tickets (category, description, affected_scope, priority, assigned_to, sla_minutes, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  insert.run('printer', 'The printer on the 2nd floor is out of toner', 'team', 'normal', 'Anna', 480, 'queued', '2026-07-06T08:00:00Z')
  insert.run('login', 'Cannot log in to the payroll system', 'me', 'normal', 'Cille', 480, 'queued', '2026-07-06T08:05:00Z')
}

export type TicketInput = {
  category: string
  description: string
  affectedScope: string
  priority: string
  assignedTo: string
  slaMinutes: number
}

export function insertTicket(t: TicketInput) {
  const stmt = db.prepare(
    `INSERT INTO tickets (category, description, affected_scope, priority, assigned_to, sla_minutes, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'queued', ?)`,
  )
  const info = stmt.run(t.category, t.description, t.affectedScope, t.priority, t.assignedTo, t.slaMinutes, new Date().toISOString())
  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(info.lastInsertRowid as number)
}

export function listTickets() {
  return db.prepare('SELECT * FROM tickets ORDER BY id DESC').all()
}
