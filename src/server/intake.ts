// Naiv placeholder-gate.
//
// OPGAVE 2 (feature): erstat denne med en LLM-drevet gate, der:
//  - tager en fri-tekst besked fra brugeren (ikke faerdige felter),
//  - selv afgoer om der er nok info til en ticket, ellers stiller et MAALRETTET opfoelgende spoergsmaal,
//  - og som IKKE finder paa (hallucinerer) de felter, den ikke har faaet. Vis at du testede det.

export const REQUIRED = ['category', 'description', 'affectedScope'] as const
export type Gathered = Partial<Record<(typeof REQUIRED)[number], string>>

export type AssessResult =
  | { status: 'ready'; gathered: Required<Gathered> }
  | { status: 'need_more'; question: string }

export function assess(gathered: Gathered): AssessResult {
  const missing = REQUIRED.filter((f) => (gathered[f] ?? '').trim().length === 0)
  if (missing.length === 0) {
    return { status: 'ready', gathered: gathered as Required<Gathered> }
  }
  // Naivt, generisk spoergsmaal (den rigtige version skal vaere maalrettet + LLM-drevet).
  return { status: 'need_more', question: 'Kan du uddybe? Vi mangler lidt mere info.' }
}
