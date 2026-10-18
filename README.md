# นครอรุณ · Siam Realm

ต้นแบบ MMORPG แฟนตาซีไทยบนเว็บ **M1**: นักดาบ, เมือง 1 แผนที่, เดินและชนสิ่งกีดขวางบน server, เห็นผู้เล่นจริง, reconnect 20 วินาที UI ไทย โค้ดอังกฤษ ส่วนต่อสู้/บัญชี/พื้นที่ล่า/ปาร์ตี้ยังเป็นงาน M2–M5 ใน TASKS.md

## ข้อสำคัญ: localhost อยู่เครื่องไหน

`localhost:5173` หมายถึงเครื่องที่กำลังเปิด browser อยู่ โค้ดใน `/workspace/game-thmmorpg` อยู่บนเครื่องพัฒนา cloud ไม่ได้ติดตั้งลง Windows ของคุณโดยอัตโนมัติ การรันบน cloud ไม่ทำให้ localhost ของ Windows เปิดได้ และตอนนี้ยังไม่มี URL สาธารณะหรือ port forwarding สำหรับเกมนี้

หากเล่นบน Windows ต้องดาวน์โหลด/คัดลอก **โปรเจกต์ทั้งโฟลเดอร์** มาไว้ในเครื่องก่อน ไม่ใช่เฉพาะไฟล์ HTML หรือโฟลเดอร์ dist ติดตั้ง Node.js 24 LTS แล้วดับเบิลคลิก `start-game.cmd` จากโฟลเดอร์ที่แตกไฟล์แล้ว รอเห็น `Vite ready` และ `Game server` จึงเปิด http://localhost:5173 และเก็บหน้าต่าง terminal ไว้ระหว่างเล่น สคริปต์ Windows นี้จัดเตรียมไว้เพื่อความสะดวก แต่ยังไม่ได้ทดสอบบน Windows จริง

หรือเปิด PowerShell ในโฟลเดอร์โปรเจกต์ (ต้องเห็น package.json) และรัน:

```powershell
npm.cmd ci
Copy-Item .env.example .env
npm.cmd run dev
```

`npm.cmd` ใช้ได้แม้ PowerShell บล็อก npm.ps1 ไม่ต้องแก้ execution policy ของระบบ หากขึ้น `ERR_CONNECTION_REFUSED` ให้ดูว่า terminal ยังเปิดและมี Vite ที่ port 5173 หรือไม่ หากหน้าเว็บเปิดได้แต่สถานะเกมเชื่อมต่อไม่ได้ ให้ตรวจ terminal ของ game server และ http://localhost:2567/health ส่งข้อความ error ของ terminal เพื่อวิเคราะห์ต่อ อย่าส่งค่า secret ใน .env

## เปิดเกมสำหรับผู้เริ่มต้น

ติดตั้ง Node.js 24 LTS (ทดสอบ 24.19.0), npm และ Docker พร้อม Compose plugin เปิด terminal ที่โฟลเดอร์โปรเจกต์:

```bash
npm ci
cp .env.example .env
npm run dev
```

รอให้เห็น Vite พร้อม แล้วเปิด **http://localhost:5173** ส่วน game server อยู่ **http://localhost:2567/health** อย่าเปิด index.html ด้วยการดับเบิลคลิก

เปิด Chrome อีกหน้าต่างแบบไม่ระบุตัวตน หรืออีก browser เพื่อได้ session แยกกัน ทั้งสองจะเห็นผู้เล่นในเมืองเดียวกัน ใช้ WASD/ลูกศร เดิน คลิกตัวละครเพื่อดูชื่อ กดปุ่ม “ทดสอบหลุดและเชื่อมต่อใหม่” เพื่อปิด WebSocket จริง ระบบจะพยายามกลับภายใน 18 วินาที และ server เก็บตัวละครเดิมสูงสุด 20 วินาที หลังหมดเวลาต้องกดลองใหม่และได้ guest ใหม่ ปิด terminal ด้วย Ctrl+C เพื่อหยุดทั้งสองบริการ

M1 ใช้ guest ใน RAM ของ server เท่านั้น จึงเปิดเกมได้ก่อนติดตั้งฐานข้อมูล การ restart server จะล้าง guest; ห้ามใช้เป็นข้อมูลตัวละครถาวร sessionStorage มีเพียง reconnect token ชั่วคราว ไม่ใช่แหล่งเก็บเงิน/ตัวละคร

## ตั้งฐานข้อมูล

จาก root โปรเจกต์ หลังคัดลอก .env:

```bash
docker compose up -d database
# รอ database เป็น healthy: docker compose ps
npm run db:migrate
npm run db:seed
```

migrate/seed ใช้ transaction ทั้งชุด พร้อม advisory lock migration มี ledger ป้องกันรันซ้ำ seed ใช้ ON CONFLICT รันซ้ำได้ Schema เตรียม accounts, sessions, characters, inventory, equipment, quests, action_receipts และข้อมูลอาชีพ 8 อาชีพ แต่ gameplay ของ M1 ยังไม่เขียนตารางเหล่านี้ ไม่ได้อ้างว่าระบบ login/ความถาวร M3 สำเร็จ

ข้อมูล PostgreSQL อยู่ Docker named volume `postgres-data` คงอยู่เมื่อ `docker compose down` อย่าใส่ `-v` หากต้องการรักษาข้อมูล รหัสผ่านใน compose เป็นค่า local เท่านั้น เปลี่ยนด้วย secret manager ก่อนโฮสต์

## คำสั่งตรวจสอบ

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
```

E2E ใช้ Chromium จริง 2 isolated browser contexts เชื่อมต่อ Colyseus จริง ทดสอบ replication, ชนกำแพง, forged payload, flood, fixed-speed และ reconnect โดยไม่สร้างตัวละครจำลอง ต้องมี Chromium หาก path ไม่ใช่ `/usr/bin/chromium` ให้ตั้ง `CHROMIUM_PATH` เช่น:

```bash
CHROMIUM_PATH=/path/to/chromium npm run test:e2e
```

หากเครื่องยังไม่มี browser ใช้ `npx playwright install chromium` แล้วกำหนด CHROMIUM_PATH เป็น executable ที่ติดตั้ง (ดู `npx playwright install --dry-run chromium`) tests เปิด server ทั้งสองให้เอง ควรหยุด `npm run dev` ก่อนเพื่อเริ่มจาก room ว่าง

ผลตรวจที่รันจริงอยู่ docs/TEST-RESULTS.md ภาพหน้าจอที่ test สร้างอยู่ work/m1-two-player.png (ignored)

## โครงสร้างและขอบเขต

- `apps/client/src/main.ts`: Phaser map/placeholder chibi, keyboard, interpolation, reconnect, click target inspection
- `apps/client/src/style.css`: Thai HTML HUD; HP/MP เป็น UI ตัวอย่าง ยังไม่มีระบบต่อสู้
- `apps/server/src/WorldRoom.ts`: Colyseus room และ guest identity จาก server
- `apps/server/src/index.ts`: HTTP health + WebSocket server
- `packages/shared/src/index.ts`: world/collision/intent validation และชื่ออาชีพ
- `db/migrations/001_initial.sql`, `db/seeds/001_content.sql`: PostgreSQL foundation
- `assets/manifest.json`, `docs/ASSETS.md`: สถานะภาพที่ขาดและสเปก animation
- `docs/DEPENDENCIES.md`: stable version decision และแหล่งทางการ; `CLAUDE.md`: คำสั่งสำคัญ; `TASKS.md`: M1–M5

Server รับเฉพาะ `{dx,dy}` ที่มีค่า finite ใน [-1,1] ใช้ session ของ connection ระบุเจ้าของ ไม่รับ position/speed/money/damage จาก client รับไม่เกิน 40 คำสั่งต่อวินาทีต่อ connection และ WebSocket payload 2 KB เดินด้วย fixed step 50 ms ความเร็วสูงสุด 180 px/s; normalize diagonal, collision ใช้ world data โดยไม่ต้อง browser และหยุด input ที่เก่ากว่า 250 ms Remote client interpolate ไปยัง state จาก server ไม่มี client position prediction

ห้องตั้ง maxClients=20 เป็นเพียงเพดานการรับเข้า **ไม่ใช่ผลทดสอบ 20 ผู้เล่น** ยังไม่มี ingress/IP admission protection, account auth, origin allowlist สำหรับ production หรือการทดสอบโหลด ให้ใช้ local เท่านั้นก่อน M5

## เตรียมโฮสต์ภายหลัง

Client build อยู่ `apps/client/dist` เป็น static assets โฮสต์แยกได้ ตั้ง `VITE_GAME_SERVER_URL=wss://...` ก่อน build เพราะเป็น build-time value ส่วน server build อยู่ `apps/server/dist` ใช้ `npm run start -w apps/server` บน Node service ที่รักษา WebSocket ได้ ติดตั้ง dependencies จาก root workspace ก่อน run เปิด PORT (default 2567) หลัง reverse proxy ที่รองรับ Upgrade และ timeout ยาวกว่า reconnect window

ฐานข้อมูลเป็น PostgreSQL แยกบริการและ persistent volume ห้ามใส่ DATABASE_URL หรือ secret ใน VITE_* หรือ client bundle M1 ยังใช้ single server / in-memory room; หากเพิ่มหลาย instance ต้องออกแบบ shared presence/matchmaker และ reconnect routing ก่อน ไม่ได้เลือกบริการโฮสต์หรือ deploy ในรอบนี้

บนเครื่องอื่นใน LAN ต้องตั้ง VITE_GAME_SERVER_URL เป็น IP ของเครื่อง server ไม่ใช่ localhost และ restart Vite โปรดใช้งานเฉพาะเครือข่ายทดสอบที่ไว้ใจได้
