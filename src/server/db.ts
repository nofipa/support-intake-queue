import { DatabaseSync } from 'node:sqlite'

// Zero-dep, embedded SQLite (Node 24). Filen support.db oprettes automatisk.
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

// Seed et par tickets foerste gang, saa koeen ikke er tom.
const { n } = db.prepare('SELECT COUNT(*) AS n FROM tickets').get() as { n: number }
if (n === 0) {
  const insert = db.prepare(
    `INSERT INTO tickets (category, description, affected_scope, priority, assigned_to, sla_minutes, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  insert.run('printer', 'Printeren paa 2. sal er loebet toer for toner', 'team', 'normal', 'Anna', 480, 'queued', '2026-07-06T08:00:00Z')
  insert.run('login', 'Kan ikke logge ind i loensystemet', 'me', 'normal', 'Cille', 480, 'queued', '2026-07-06T08:05:00Z')
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
