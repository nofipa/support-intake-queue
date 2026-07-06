// Naive placeholder gate.
//
// TASK 2 (feature): replace this with an LLM-driven gate that:
//  - takes a free-text message from the user (not ready-made fields),
//  - decides on its own whether there is enough info to create a ticket, otherwise asks a TARGETED follow-up question,
//  - and does NOT fabricate (hallucinate) the fields it was not given. Show that you tested this.

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
  // Naive, generic question (the real version should be targeted + LLM-driven).
  return { status: 'need_more', question: 'Could you give me a bit more detail? Some information is missing.' }
}
