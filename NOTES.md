# NOTES.md (Living Memory)

## 1. Current status
Phase 0, 1, 2, 3 done and verified (tests passing, real RPC verified, logging privacy verified). Phase 4 starting.

## 2. Phase log
- [x] Phase 0: Scaffold
- [x] Phase 1: Chain connection
- [x] Phase 2: Database and users
- [x] Phase 3: Auth (passkey)
- [ ] Phase 4: AUSD balance and transfer
- [ ] Phase 5: Aurora Intents adapter
- [ ] Phase 6: History and live status
- [ ] Phase 7: Hardening and docs

## 3. Verified facts
- **Monad testnet public RPC**: `https://testnet-rpc.monad.xyz`, chain id 10143, native token MON. Verified on 2026-09-30. Source: https://docs.monad.xyz/developer-essentials/testnets
- **Backup public RPCs**: `https://rpc.ankr.com/monad_testnet` and `https://rpc-testnet.monadinfra.com`
- **Testnet explorer**: https://testnet.monadscan.com, **faucet**: https://faucet.monad.xyz (from Monad docs)
- **Mainnet reference** (NOT used by this project): chain id 143, https://rpc.monad.xyz

## 4. Open questions and TODOs
- AUSD testnet address and decimals.
- Mera SDK package and usage.
- Aurora Intents testnet support.
- Alchemy Monad endpoint.
- Whether a PWA qualifies for the Agora mobile-app bounty.
- Whether testnet is acceptable for submission (ask organizers on Discord).
- Phone verification (OTP) needs to be implemented to secure phone-based lookups.

## 5. Decisions
- Phone lookup is POST `/users/lookup` with a JSON body; GET `/users/lookup?handle=...` is handle-only.
- The first claimant of a phone number owns the lookup, as there is currently no OTP verification. This is spoofable and must not be presented as secure.
- Expected 4xx errors are logged at WARN.
- Using JWT for short-lived sessions after WebAuthn/Passkey auth.

## 6. Known issues / lessons
- `https://rpc-devnet.monad.xyz` and `https://rpc.testnet.monad.xyz` do not resolve (ENOTFOUND), never use them.
- Phone numbers leaked through `req.url` and SQL verbose logging; fixed in Phase 2 follow-up.
- Phone numbers leaked through `app.ts` spreading `req` in `pinoHttp` serializers, exposing `req.raw.body`. Fixed by explicitly picking safe properties for `req` serializer and adding comprehensive pino redact paths.
- Auth routes lacked rate limits and `login/start` allowed handle enumeration; fixed by adding `express-rate-limit` and returning identical generic responses for known/unknown handles.
- `DEBUG_SQL` caveat: better-sqlite3 verbose logging must stay disabled for sensitive data. The earlier claim that better-sqlite3 verbose never exposes parameters was wrong.

## 7. Environment variables
| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| PORT | Server port | Optional | 3000 |
| NODE_ENV | Environment mode | Optional | development |
| MOCK_CHAIN | Use mock chain adapter | Optional | true |
| MONAD_RPC_URL | Monad testnet RPC URL | Required if MOCK_CHAIN=false | - |
| DB_PATH | Path to SQLite DB | Optional | ./data/tapremit.db |
| DEBUG_SQL | Enable SQLite query logging | Optional | false |
| MOCK_AUTH | Use mock auth adapter | Optional | true |
| WEBAUTHN_RP_ID | WebAuthn Relying Party ID | Optional | localhost |
| WEBAUTHN_RP_NAME | WebAuthn Relying Party Name | Optional | TapRemit |
| WEBAUTHN_ORIGIN | WebAuthn Origin URL | Optional | http://localhost:3000 |
| JWT_SECRET | Secret for signing JWTs | Required if MOCK_AUTH=false | mock_... |
| JWT_EXPIRY | JWT expiration time | Optional | 1h |
| AUTH_RATE_LIMIT_MAX | Max auth requests per window | Optional | 20 |
| AUTH_RATE_LIMIT_WINDOW_MS | Auth rate limit window (ms) | Optional | 900000 |
| AUTH_IP_RATE_LIMIT_MAX | Max auth requests per IP (overall) | Optional | 60 |
| AUTH_IP_RATE_LIMIT_WINDOW_MS | Auth IP rate limit window (ms) | Optional | 900000 |
| ME_RATE_LIMIT_MAX | Max requests for /auth/me per window | Optional | 120 |
| ME_RATE_LIMIT_WINDOW_MS | /auth/me rate limit window (ms) | Optional | 60000 |

*Note: When deploying behind a reverse proxy (e.g., Vercel, Nginx), `trust proxy` must be configured in Express so the rate limiter sees real client IPs. Limiter counters are stored in memory and reset on server restart.*

## 8. API contract
- **GET /health**
  - **Auth**: None
  - **Response**: `{ "status": "ok", "timestamp": "...", "uptime": 123.45 }`

- **GET /chain/status**
  - **Auth**: None
  - **Response**: `{ "blockNumber": 66789166, "latencyMs": 517 }`

- **POST /auth/register/start**
  - **Auth**: None
  - **Request**: `{ "handle": "alice", "display_name": "Alice", "phone": "+1234" }`
  - **Response**: WebAuthn options or mock challenge

- **POST /auth/register/finish**
  - **Auth**: None
  - **Request**: `{ "handle": "alice", "response": {...} }`
  - **Response**: `{ "token": "jwt..." }`

- **POST /auth/login/start**
  - **Auth**: None
  - **Request**: `{ "handle": "alice" }`
  - **Response**: WebAuthn options or mock challenge

- **POST /auth/login/finish**
  - **Auth**: None
  - **Request**: `{ "handle": "alice", "response": {...} }`
  - **Response**: `{ "token": "jwt..." }`

- **GET /auth/me**
  - **Auth**: Required (JWT Bearer)
  - **Response**: `{ "id": "...", "handle": "alice", "display_name": "Alice", "phone": "+1234", "wallet_address": null }`

- **GET /users/lookup?handle=...**
  - **Auth**: Required (JWT Bearer)
  - **Response**: `{ "handle": "alice", "display_name": "Alice" }`

- **POST /users/lookup**
  - **Auth**: Required (JWT Bearer)
  - **Request**: `{ "phone": "+1234567890" }` or `{ "handle": "alice" }`
  - **Response**: `{ "handle": "alice", "display_name": "Alice" }`

## 9. Bounty proof
- **Agora**: Not started
- **Aurora**: Not started
- **Mera**: Placeholder. WebAuthn adapter implemented but untested with a real authenticator.
