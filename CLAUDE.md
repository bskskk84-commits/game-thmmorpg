# Project scope and commands

Thai fantasy browser MMORPG. Current implementation scope is M1 only. UI Thai; code/file names English. Never claim 20 concurrent players without an actual measured test. Never substitute bot rendering for multiplayer connections.

Layout: apps/client (Phaser 3 + Vite), apps/server (Node + Colyseus 0.16), packages/shared (headless collision/protocol/content), db (PostgreSQL migration/seed), tests (unit + actual two-context Chromium WebSocket integration).

Run from repo root: npm ci; cp .env.example .env; npm run dev. Database: docker compose up -d database; npm run db:migrate; npm run db:seed. Checks: npm run typecheck; npm test; npm run build; npm run test:e2e. Set CHROMIUM_PATH for installed Chromium. See README for browser installation alternative.

Server owns identity, movement, collision, speed, future combat/economy. Accept intents only. Never trust a supplied character ID for ownership. Preserve useDefineForClassFields=false for schema setters. Keep Colyseus server/client protocol versions compatible. Reconnect expires after 20 sec. Guest state is transient and is NOT durable account storage.

M3: authenticated accounts, Argon2id passwords, hashed/revocable sessions, transaction + row locks + idempotency receipts, ownership enforcement. Never put secrets in VITE_* or use localStorage as database. Future content goes into separate shared data modules. Preserve referenced assets and manifest status. No hosting selected or deployment authorized in this phase.
