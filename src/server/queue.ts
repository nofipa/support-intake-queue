// Queue: prioritization + assignment.

const TEAMS: Record<string, string[]> = {
  printer: ['Anna', 'Bo'],
  login: ['Cille'],
  network: ['Dan', 'Eva'],
}
const DEFAULT_TEAM = ['Frank']

const SLA_MINUTES: Record<'high' | 'normal', number> = { high: 60, normal: 480 }

export function prioritize(t: { description: string; affectedScope: string }): 'high' | 'normal' {
  if (t.affectedScope === 'all') return 'high'
  if (/not working|down|cannot|can't/i.test(t.description) && t.affectedScope === 'team') return 'high'
  return 'normal'
}

export function slaFor(priority: 'high' | 'normal'): number {
  return SLA_MINUTES[priority]
}

// TASK 1 (bug): round-robin is broken - all tickets in the same category get
// assigned the SAME agent. Reproduce it with a test, then fix it.
let _rr = 0
export function assign(category: string): string {
  const team = TEAMS[category] ?? DEFAULT_TEAM
  let i = 0
  const agent = team[i % team.length]
  _rr++
  return agent
}
