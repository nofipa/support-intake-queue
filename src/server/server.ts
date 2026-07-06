import { createServer } from 'node:http'
import { assess, type Gathered } from './intake.ts'
import { prioritize, slaFor, assign } from './queue.ts'
import { insertTicket, listTickets } from './db.ts'

const PORT = 3000

function json(res: import('node:http').ServerResponse, status: number, body: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(body))
}

async function readBody(req: import('node:http').IncomingMessage): Promise<any> {
  const chunks: Buffer[] = []
  for await (const c of req) chunks.push(c as Buffer)
  if (chunks.length === 0) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {})

  if (req.method === 'GET' && req.url === '/tickets') {
    return json(res, 200, listTickets())
  }

  // POST /intake { gathered } -> either a follow-up question or a created ticket.
  if (req.method === 'POST' && req.url === '/intake') {
    const body = await readBody(req)
    const gathered: Gathered = body.gathered ?? {}
    const result = assess(gathered)
    if (result.status === 'need_more') {
      return json(res, 200, { status: 'need_more', question: result.question })
    }
    const g = result.gathered
    const priority = prioritize({ description: g.description, affectedScope: g.affectedScope })
    const ticket = insertTicket({
      category: g.category,
      description: g.description,
      affectedScope: g.affectedScope,
      priority,
      assignedTo: assign(g.category),
      slaMinutes: slaFor(priority),
    })
    return json(res, 201, { status: 'created', ticket })
  }

  json(res, 404, { error: 'not found' })
})

server.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
