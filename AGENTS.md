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

## Privacy and Logging Rules
- Never log personal or secret data: phone numbers, tokens, JWTs, passkey credentials, challenges, private keys, API keys. Redaction must cover body, query AND url.
- Never put sensitive data in URLs or query strings (use POST with a JSON body). Log only the URL path, never the query string.
- Never log SQL bound parameters. DEBUG_SQL must stay false by default and must never be enabled with real or sensitive data.
- Public and lookup endpoints return only public fields (handle, display_name). Never return phone, wallet address, or internal ids from them.
- Expected client errors (400, 401, 404, 409) are logged at WARN with a short message and no stack. Only real 5xx errors use ERROR with a stack.
- Every phase that touches user data or auth must include a test that captures log output and asserts sensitive strings do not appear.

## Accuracy and Verification Rules
- Do not state facts about third-party SDKs, contracts or APIs unless they are in NOTES.md "Verified facts" with a source. If unsure, say "unverified" instead of asserting.
- Do not invent or default URLs, addresses, package names or method names. Wrong guessed RPC hostnames already cost us time.
- Do not claim a library behaves a certain way without evidence. When unsure, say so.
- Do not claim "verified" or "thoroughly tested" unless the test actually exercises that behavior. Say exactly what was and was not tested.

## Environment Rules
- Developer machine is Windows PowerShell. Give commands for PowerShell: use curl.exe (not curl) or Invoke-RestMethod.
- ts-node-dev does not reload .env. Remind me to restart the dev server after any .env change.
- Speed claims: latencyMs from /chain/status is laptop-to-public-RPC round trip, NOT Monad block time or finality. Never use it as a speed claim. Use only the measured send-to-confirmed time from Phase 4.

## Workflow Rules
- Before every commit remind me to run `git status` and confirm no .env, backend/data/, .db, -wal or -shm files are staged.
- Suggest commit messages as plain text, without markdown fences or a "text" label.
- If a plan step relies on an unverified sponsor requirement (e.g. PWA Agora bounty), list it in NOTES.md Open questions instead of assuming.
