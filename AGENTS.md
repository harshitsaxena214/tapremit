# AGENTS.md (Rules for AI coding agent)

1. **Project overview**: TapRemit, a stablecoin remittance PWA on Monad testnet for the Monad Metropolis hackathon (track: Consumer Products & Payments). Passkey login (Mera), cross-chain deposits (Aurora Intents), AUSD payments on Monad. Team of 2, about 8 days. Backend first, then frontend.
2. **Tech stack**: backend in `/backend` (Node 20, TypeScript, Express, viem, zod, better-sqlite3, pino, vitest + supertest). Frontend later in `/frontend` (Next.js App Router, Tailwind, PWA).
3. **Hard rules**:
   - NEVER invent contract addresses, API endpoints, SDK package names, or SDK method names. If unknown, add a TODO, read it from an env variable, and log it under "Open questions" in `NOTES.md`.
   - Every external service (Mera, Aurora, AUSD relayer, Alchemy) goes behind an adapter with a real and a mock implementation, switched by env flags (`MOCK_AUTH`, `MOCK_AURORA`, `MOCK_CHAIN`). The app must always run end to end in mock mode.
   - Testnet only. Never commit secrets. Keep `.env` in `.gitignore`. Every new env variable goes into `.env.example`.
   - Keep code simple and readable. No over-engineering.
   - Work one phase at a time. When a phase is done: run tests, show me how to test it, update `NOTES.md`, suggest a commit message, then STOP and wait for me to say "next".
   - Do not modify files outside the current phase's scope without asking. Do not add dependencies without telling me why.
4. **Code conventions**: TypeScript strict, zod validation, pino logging, small files, one route file per feature, business logic in `services/`, external calls in `adapters/`.
5. **Before every session**: read `NOTES.md` fully.
