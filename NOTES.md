# NOTES.md (Living Memory)

## 1. Current status
Phase 1 (Chain connection) is completed. The backend has a viem public client for Monad testnet and a /chain/status endpoint, switchable via MOCK_CHAIN flag.

## 2. Phase log
- [x] Phase 0: Scaffold (Init project, TS config, Express, Zod, Pino, /health)
- [x] Phase 1: Chain connection
- [ ] Phase 2: Database and users
- [ ] Phase 3: Auth (passkey)
- [ ] Phase 4: AUSD balance and transfer
- [ ] Phase 5: Aurora Intents adapter
- [ ] Phase 6: History and live status
- [ ] Phase 7: Hardening and docs

## 3. Verified facts
*(None verified yet)*

## 4. Open questions and TODOs
- Need exact AUSD contract address on Monad testnet.
- Need Mera SDK documentation and API details for auth.
- Need Aurora Intents testnet contract/SDK details.
- Need Alchemy Monad testnet RPC details.
- Monad testnet RPC URL needs manual verification (currently assuming https://rpc-devnet.monad.xyz/).

## 5. Decisions
- Scaffold created with standard Express structure, Pino for logging, and Zod for env validation.

## 6. Environment variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production/test)

## 7. API contract
- **GET /health**
  - **Auth**: None
  - **Request**: No body
  - **Response**: `{ "status": "ok", "timestamp": "...", "uptime": 123.45 }`
  - **cURL**: `curl http://localhost:3000/health`

- **GET /chain/status**
  - **Auth**: None
  - **Request**: No body
  - **Response**: `{ "blockNumber": 5001234, "latencyMs": 45 }`
  - **cURL**: `curl http://localhost:3000/chain/status`

## 8. Known issues
*(None yet)*

## 9. Bounty proof
- **Agora**: Not started
- **Aurora**: Not started
- **Mera**: Not started
- **Alchemy**: Not started
