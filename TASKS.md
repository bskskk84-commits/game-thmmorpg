# Milestones

## M1 — ผ่านการทดสอบ 2 ผู้เล่นจริง; validation in docs/TEST-RESULTS.md
- [x] npm workspaces: client/server/shared, lockfile
- [x] Phaser Thai UI, swordsman placeholder, server-issued guests, real Colyseus WebSocket room
- [x] Authoritative fixed-step movement, shared headless collision, normalized diagonal speed
- [x] Payload allowlist, message size/frequency limits, no client-selected owner/position
- [x] Remote interpolation, Thai connection states, 20-second reconnect reservation
- [x] PostgreSQL migration/seed foundation, separate services
- [x] Unit and real two-browser-context tests, setup docs

## M2 — next, not implemented
- [ ] Separate data modules: skills, monsters (2 types), damage/EXP formulas
- [ ] Target selection of monsters, basic attack + starting skill; server range/cooldown/MP/HP
- [ ] Death/respawn, EXP/levels, authoritative drop ownership
- [ ] Invalid/duplicate action and range/cooldown integration tests

## M3 — not implemented
- [ ] Account creation/login/logout with Argon2id and rate limiting; hashed/revocable session tokens; secure transport and origin policy
- [ ] Character ownership, durable load/save with PostgreSQL; restart-resume integration test
- [ ] Inventory, equipment, potion, NPC shop, one short quest
- [ ] Purchase/use/reward in transactions with row locks and request receipts; concurrent double-spend/replay tests

## M4 — not implemented
- [ ] Add knight/archer/healer/mage/rogue/muaythai/merchant
- [ ] Each of 8 classes: basic attack + 2 active skills + 1 passive, data-driven balance
- [ ] 3 weapon tiers per class, potions/food/buffs matched to supplied references
- [ ] Import/validate real idle/walk/attack/hurt/death atlases (see docs/ASSETS.md)

## M5 — not implemented
- [ ] Party, validated local chat, town↔hunting map transfer with ownership continuity
- [ ] Real 20 clients/map load test; report hardware, duration, tick time, RTT, bandwidth, errors, reconnect and memory
- [ ] Soak test, cleanup, abuse tests, backup/restore, staging WSS + persistent PostgreSQL
- [ ] Select hosting only after local acceptance; no scalability promise before measurements
