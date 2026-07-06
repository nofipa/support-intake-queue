# Support intake + koe (case)

En lille, koerende support-intake-app. Din opgave er at forbedre den. Vi er mere interesserede i *hvordan* du arbejder, isaer med AI, end i et poleret resultat. Regn med omkring en time. Byg en fungerende slice, ikke et faerdigt produkt. Brug dit eget AI-setup, som du ville paa jobbet.

## Koer projektet
Ingen Docker, ingen database-server. SQLite er indbygget (Node 24). Du skal bruge **Node 24+**.

```
npm install          # kun for React-frontend'en
npm run dev:api      # backend paa http://localhost:3000 (ingen deps, koerer TypeScript direkte)
npm run dev:web      # frontend paa http://localhost:5173 (ny terminal)
npm test             # backend-tests (node:test)
```

Backend ligger i `src/server/` (Node + `node:sqlite`, zero-dep). Frontend i `src/web/` (React + Vite).

## Dine opgaver

**1. Fix en bug.** Round-robin-tildelingen i `src/server/queue.ts` virker ikke: alle tickets i samme kategori faar tildelt den *samme* agent. Reproducer den med en test, og fix den.

**2. Tilfoej feature'en (kernen).** Den nuvaerende "er der nok info"-gate i `src/server/intake.ts` er en naiv placeholder, der antager faerdige felter. Byg den om til en **LLM-drevet** gate, hvor:
- brugeren skriver i **fri tekst**,
- bot'en selv afgoer, om der er nok info til en ticket, ellers stiller et **maalrettet** opfoelgende spoergsmaal,
- og bot'en **ikke finder paa** (hallucinerer) de felter, den ikke har faaet.
Vis, at du testede den adfaerd.

**3. Haandter edge cases.** Fx tom besked, rent vroevl, eller en besked der allerede har nok info i sig.

Du bestemmer selv datamodellen, hvad "nok info" betyder, felterne, koe-/prioriterings-reglerne, og hvordan du loeser det. Der er ikke ét rigtigt svar. **Skriv dine antagelser ned.**

## Aflever
Vi forventer ikke, at det er faerdigt. Aflever:
- **En kort plan/tilgang:** hvordan greb du det an, og hvorfor.
- **Din fungerende slice**, saa langt du naaede.
- **Din raa AI-/agent-session** (ikke pyntet).
- **Antagelser + review:** dine vigtigste antagelser, og hvad du ville teste eller tjekke foer produktion.

Bagefter tager vi en kort snak, hvor du gaar os gennem loesningen, ogsaa de dele AI genererede.
