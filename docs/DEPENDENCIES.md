# Dependency decision · 2026-10-18

ใช้ stable release ที่เข้ากันได้แบบ exact version + package-lock.json ไม่เลือก prerelease และไม่ได้อ้างว่าเป็นรุ่นล่าสุดทุกตัว

- Node.js ทดสอบ 24.19.0; engine >=22.12
- Phaser 3.90.0: เลือกสาย Phaser 3 ซึ่งมี API ที่ใช้ทดสอบนี้ แม้ npm latest เป็น 4.2.1
- Vite 6.4.1, TypeScript 5.9.3: stable รุ่นที่รองรับ Node ที่ระบุ ไม่ย้ายไป major ล่าสุดระหว่าง M1
- Colyseus core 0.16.26 + ws-transport 0.16.5 + colyseus.js 0.16.22 + schema 3.0.76: ใช้สาย 0.16 ทั้ง client/server; core peer dependency ต้อง schema ^3.0.0 อย่ารวม schema 5 หรือ SDK สาย 0.18 เข้ามาโดยไม่ทดสอบ migration
- PostgreSQL 17.6, pg 8.16.3

ตรวจ npm registry dist versions/peerDependencies จริง และอ่านแหล่งทางการผ่าน GitHub:

- https://github.com/colyseus/colyseus/blob/0.16/packages/core/src/Room.ts — allowReconnection และ simulation interval
- https://github.com/colyseus/colyseus.js/blob/0.16/src/Client.ts — reconnect token
- https://github.com/colyseus/schema — defineTypes และ state synchronization; ตั้ง useDefineForClassFields=false เพื่อคง schema setters
- https://github.com/phaserjs/template-vite-ts — โครงสร้าง Phaser + Vite + TypeScript (template ปัจจุบันใช้ Phaser 4 จึงไม่คัด dependency major มาปะปน)
- https://github.com/vitejs/vite/tree/v6.4.1/docs — build และ envDir
- https://github.com/postgres/postgres/tree/REL_17_STABLE/doc/src/sgml — transactions, constraints, advisory locks

ก่อน production ต้องทบทวน security advisories และการอัปเกรดทั้งชุด พร้อม regression tests อีกครั้ง
