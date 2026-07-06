import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assess } from './intake.ts'
import { prioritize, slaFor } from './queue.ts'

test('assess: manglende felter -> need_more (og opretter ikke)', () => {
  const r = assess({ category: 'printer' })
  assert.equal(r.status, 'need_more')
})

test('assess: tomt/whitespace felt taeller ikke som udfyldt', () => {
  const r = assess({ category: 'printer', description: '   ', affectedScope: 'me' })
  assert.equal(r.status, 'need_more')
})

test('assess: alle felter til stede -> ready', () => {
  const r = assess({ category: 'printer', description: 'virker ikke', affectedScope: 'me' })
  assert.equal(r.status, 'ready')
})

test('prioritize: rammer alle -> high + kort SLA', () => {
  assert.equal(prioritize({ description: 'noget', affectedScope: 'all' }), 'high')
  assert.equal(slaFor('high'), 60)
})

test('prioritize: enkelt bruger -> normal', () => {
  assert.equal(prioritize({ description: 'lille ting', affectedScope: 'me' }), 'normal')
})

// Bemaerk: der er BEVIDST ingen test af assign(). Den har en bug (opgave 1) -
// kandidaten skal selv reproducere den med en test og fikse den.
