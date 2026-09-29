# NOTES.md (Living Memory)

## 1. Current status
Phase 0 done, Phase 1 done and verified in real mode, Phase 2 starting.

## 2. Phase log
- [x] Phase 0: Scaffold
- [x] Phase 1: Chain connection
- [ ] Phase 2: Database and users
- [ ] Phase 3: Auth (passkey)
- [ ] Phase 4: AUSD balance and transfer
- [ ] Phase 5: Aurora Intents adapter
- [ ] Phase 6: History and live status
- [ ] Phase 7: Hardening and docs

## 3. Verified facts
- **Monad testnet public RPC**: `https://testnet-rpc.monad.xyz`, chain id 10143, native token MON. Verified on 2026-09-30 (eth_blockNumber call and GET /chain/status returned realistic data). Source: https://docs.monad.xyz/developer-essentials/testnets
- **Backup public RPCs**: `https://rpc.ankr.com/monad_testnet` and `https://rpc-testnet.monadinfra.com`
- **Testnet explorer**: https://testnet.monadscan.com, **faucet**: https://faucet.monad.xyz (from Monad docs)
- **Mainnet reference** (NOT used by this project): chain id 143, https://rpc.monad.xyz

## 4. Open questions and TODOs
- AUSD testnet address and decimals.
- Mera SDK package and usage.
- Aurora Intents testnet support.
- Alchemy Monad endpoint.
- Whether a PWA qualifies for the Agora mobile-app bounty (ask organizers on Discord).

## 5. Decisions
- Scaffold created with standard Express structure, Pino for logging, and Zod for env validation.
- Switched phone lookups to POST /users/lookup with JSON body to prevent phone numbers appearing in URLs, and stripped query strings from pino-http logs.
- Expected client errors (400, 404, 409) log as WARN without stack traces, reserving ERROR for true 5xx faults.
- Better-sqlite3 `verbose` logging is disabled by default and requires the `DEBUG_SQL` flag. Bound params are never logged.

## 6. Known issues / lessons
- `https://rpc-devnet.monad.xyz` and `https://rpc.testnet.monad.xyz` both failed with ENOTFOUND. They were wrong/guessed URLs. Never use them. The working URL is `https://testnet-rpc.monad.xyz`.
- The latencyMs returned is round-trip time from the laptop to a public RPC, NOT Monad's block time or finality. Do not use it for speed claims. In Phase 4, add a proper measurement of send-to-confirmed time.
- Environment: Windows PowerShell. Use `curl.exe` (not `curl`) or `Invoke-RestMethod` in all examples. Restart the dev server after editing `.env` because ts-node-dev does not reload it.

## 7. Environment variables
- `PORT`: Server port (default: 3000, optional)
- `NODE_ENV`: Environment mode (development/production/test) (optional)
- `MOCK_CHAIN`: Use mock chain adapter (default: true, optional)
- `MONAD_RPC_URL`: Monad testnet RPC URL (required when MOCK_CHAIN is false)
- `DB_PATH`: Path to SQLite database file (default: ./data/tapremit.db, optional)
- `DEBUG_SQL`: Enable sqlite query logging (default: false, optional)

## 8. API contract
- **GET /health**
  - **Auth**: None
  - **Request**: No body
  - **Response**: `{ "status": "ok", "timestamp": "...", "uptime": 123.45 }`
  - **cURL**: `curl.exe http://localhost:3000/health`

- **GET /chain/status**
  - **Auth**: None
  - **Request**: No body
  - **Response**: `{ "blockNumber": 66789166, "latencyMs": 517 }`
  - **cURL**: `curl.exe http://localhost:3000/chain/status`

- **POST /users** (temporary, will be protected/changed in Phase 3)
  - **Auth**: None
  - **Request**: `{ "handle": "alice", "display_name": "Alice", "phone": "+1234567890" }` (phone is optional)
  - **Response**: `{ "id": "uuid...", "handle": "alice", "display_name": "Alice", "created_at": "..." }` (no phone or wallet returned)
  - **cURL**: `Invoke-RestMethod -Method Post -Uri http://localhost:3000/users -ContentType "application/json" -Body '{"handle":"alice","display_name":"Alice"}'`

- **GET /users/lookup?handle=...** (temporary, will be protected/changed in Phase 3)
  - **Auth**: None
  - **Request**: Query param `handle`
  - **Response**: `{ "handle": "alice", "display_name": "Alice" }`
  - **cURL**: `curl.exe "http://localhost:3000/users/lookup?handle=alice"`

- **POST /users/lookup** (temporary, will be protected/changed in Phase 3)
  - **Auth**: None
  - **Request**: `{ "phone": "+1234567890" }` or `{ "handle": "alice" }`
  - **Response**: `{ "handle": "alice", "display_name": "Alice" }`
  - **cURL**: `Invoke-RestMethod -Method Post -Uri http://localhost:3000/users/lookup -ContentType "application/json" -Body '{"phone":"+1234567890"}'`

## 9. Bounty proof
- **Agora**: Not started
- **Aurora**: Not started
- **Mera**: Not started
- **Alchemy**: Not started
