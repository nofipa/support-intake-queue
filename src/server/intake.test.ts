import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assess } from './intake.ts'
import { prioritize, slaFor } from './queue.ts'

test('assess: missing fields -> need_more (does not create)', () => {
  const r = assess({ category: 'printer' })
  assert.equal(r.status, 'need_more')
})

test('assess: empty/whitespace field does not count as filled', () => {
  const r = assess({ category: 'printer', description: '   ', affectedScope: 'me' })
  assert.equal(r.status, 'need_more')
})

test('assess: all fields present -> ready', () => {
  const r = assess({ category: 'printer', description: 'not working', affectedScope: 'me' })
  assert.equal(r.status, 'ready')
})

test('prioritize: affects everyone -> high + short SLA', () => {
  assert.equal(prioritize({ description: 'something', affectedScope: 'all' }), 'high')
  assert.equal(slaFor('high'), 60)
})

test('prioritize: single user -> normal', () => {
  assert.equal(prioritize({ description: 'small thing', affectedScope: 'me' }), 'normal')
})

// Note: there is deliberately no test for assign(). It has a bug (task 1) -
// the candidate should reproduce it with a test and fix it.
