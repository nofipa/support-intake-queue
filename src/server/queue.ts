// Koe: prioritering + tildeling.

const TEAMS: Record<string, string[]> = {
  printer: ['Anna', 'Bo'],
  login: ['Cille'],
  netvaerk: ['Dan', 'Eva'],
}
const DEFAULT_TEAM = ['Frank']

const SLA_MINUTES: Record<'high' | 'normal', number> = { high: 60, normal: 480 }

export function prioritize(t: { description: string; affectedScope: string }): 'high' | 'normal' {
  if (t.affectedScope === 'all') return 'high'
  if (/virker ikke|nede|down|kan ikke/i.test(t.description) && t.affectedScope === 'team') return 'high'
  return 'normal'
}

export function slaFor(priority: 'high' | 'normal'): number {
  return SLA_MINUTES[priority]
}

// OPGAVE 1 (bug): round-robin virker ikke - alle tickets i samme kategori faar
// tildelt den SAMME agent. Reproducer med en test, og fix den.
let _rr = 0
export function assign(category: string): string {
  const team = TEAMS[category] ?? DEFAULT_TEAM
  let i = 0
  const agent = team[i % team.length]
  _rr++
  return agent
}
