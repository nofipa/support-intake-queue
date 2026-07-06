# Support intake + queue (case)

A small, working support-intake app. Your job is to improve it. We care more about *how* you work, especially with AI, than about a polished result. Budget about an hour (a guideline, not a hard limit). Build a working slice, not a finished product. Use your own AI setup, exactly as you would on the job.

If you run low on time, **task 2 below is what we weight most** - task 1 is a warm-up.

## Run it
No Docker, no database server. SQLite is built in (Node 24). You need **Node 24+**.

```
npm install          # only for the React frontend
npm run dev:api      # backend on http://localhost:3000 (no deps, runs TypeScript directly)
npm run dev:web      # frontend on http://localhost:5173 (new terminal)
npm test             # backend tests (node:test)
```

Backend lives in `src/server/` (Node + `node:sqlite`, zero-dep). Frontend in `src/web/` (React + Vite).

## Your tasks

**1. Fix a bug (warm-up).** There is a bug in the assignment logic in `src/server/queue.ts`. Find it, reproduce it with a test, and fix it.

**2. Add the feature (the core).** The current "is there enough info" gate in `src/server/intake.ts` is a naive placeholder that assumes ready-made fields. Rebuild it as an **LLM-driven** gate where:
- the user types in **free text**,
- the bot decides on its own whether there is enough info to create a ticket, otherwise asks a **targeted** follow-up question,
- and the bot does **not fabricate** (hallucinate) the fields it was not given.
Show that you tested this behavior.

> Note: your coding assistant (Claude Code, Codex, a subscription, etc.) is not the same as the app's LLM. For the gate itself you can use your own API key, ask us for a temporary one, or stub the LLM behind a clean interface. A stub is completely fine - and it makes it easy to test that your guard catches a hallucinated response.

**3. Handle edge cases.** For example an empty message, pure gibberish, or a message that already contains enough info.

You decide the data model, what "enough info" means, the fields, the queue/prioritization rules, and how you solve it. There is no single right answer. **Write down your assumptions.**

## What to submit
We do not expect it to be finished. Submit:
- **A short plan/approach:** how you tackled it, and why.
- **Your working slice**, as far as you got.
- **Your raw AI/agent session** (unedited).
- **Assumptions + review:** your key assumptions, and what you would test or check before production.

Afterwards we will have a short conversation where you walk us through your solution, including the parts AI generated.
