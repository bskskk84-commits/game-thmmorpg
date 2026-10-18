# ผลทดสอบ M1 · 18 ตุลาคม 2026

สถานะ: ผ่านเกณฑ์ M1 ที่ทดสอบด้านล่าง ไม่ใช่ผลรับรอง production หรือ load test

เครื่องทดสอบ Linux, Node 24.19.0, npm 11.9.0, Chromium system executable `/usr/bin/chromium`, PostgreSQL 17.6 ผ่าน Docker Compose

| การตรวจ | ผลจริง |
| --- | --- |
| `npm ci` จาก package-lock.json | ผ่าน |
| `npm run typecheck` | ผ่าน |
| `npm test` | ผ่าน 3 tests: forged payload, normalized/fixed speed, headless collision/bounds |
| `npm run build` | ผ่าน Vite client และ tsup server; server bundle รวม shared code แล้ว |
| `npm run dev` ตาม README | เปิด Vite 5173 + Colyseus 2567 จริง; HTTP index และ health ตอบสำเร็จ |
| `npm run test:e2e` รอบสุดท้าย | ผ่าน 1 integration scenario, 12.8 วินาที (runner รวม 14.0 วินาที) |
| Two browser contexts | Chromium 2 contexts แยก session เข้า room เดียวกันผ่าน WebSocket จริง, session IDs ต่างกัน |
| Replication | กด D ใน browser แรก ตำแหน่งที่ browser ที่สองได้รับขยับจริง |
| Collision | เดินชนวัดที่ x=420; state จาก server หยุดที่ขอบก่อนกำแพง โดยรวม radius=14 |
| Invalid movement | ปฏิเสธทิศทางเกินขอบเขต, payload ที่มี x เพิ่ม, และคำสั่งเพิ่มเงินที่ไม่อนุญาต |
| Message flood | ส่ง 200 move intents ทันที ได้ข้อความถี่เกินไป; ระยะเดินยังถูกจำกัดโดย server tick |
| Reconnection | ปิด WebSocket จริงด้วยปุ่มใน UI; reconnect ในช่วง 20 วินาที กลับด้วย session ID เดิม; อีก browser ยังเห็นเพียง 2 ตัวละคร ไม่เกิดตัวซ้ำ |
| UI/runtime | สถานะภาษาไทย เชื่อมต่อ/หลุด/กำลังเชื่อมต่อใหม่/เชื่อมต่อใหม่สำเร็จ; ไม่มี pageerror ในทั้งสอง contexts; ตรวจ screenshot ด้วยตาแล้วเห็นผู้เล่นทั้งสอง |
| Production server smoke | เปิด `npm run start -w apps/server` จาก bundle ที่ port 2568 แล้ว SDK client จริง 2 ตัวเข้า room เดียว รับ state ผู้เล่น 2 คนสำเร็จ |
| `docker compose up -d database` | PostgreSQL healthy |
| `npm run db:migrate`, `npm run db:seed` | ผ่านบน PostgreSQL จริง แล้วรันทั้งสองคำสั่งซ้ำผ่าน; class_definitions=8, schema_migrations=1 |

**จำนวนที่ทดสอบจริงสูงสุดต่อแผนที่: 2 ผู้เล่นพร้อมกัน** ไม่มีการทดสอบ 20 คน ไม่มีผล RTT/throughput/tick percentile หรือ soak test การตั้ง maxClients=20 เป็น config เท่านั้น

ข้อจำกัด: M1 guest อยู่ RAM และหายเมื่อ restart game server, ยังไม่มีบัญชีและ durable character gameplay, พื้นที่ล่าและระบบ M2–M5 ยังไม่ทำ รูปแบบภาพเป็น procedural placeholder ไม่ใช่ภาพ SD วาดสำเร็จ และยังไม่มี animation atlas จริง ไม่มีไฟล์อ้างอิงที่ผู้ใช้ระบุใน repository เริ่มต้น ดู docs/ASSETS.md

Vite build มีคำเตือน bundle ใหญ่ (Phaser รวมอยู่ประมาณ 1.62 MB ก่อน gzip / 385 KB gzip) ไม่ได้ทำ performance optimization ใน M1 การทดสอบนี้ทำในเครื่องเดียว ไม่ใช่ WAN test

พบและแก้ระหว่างพัฒนา: TypeScript class fields ทับ schema setters ทำให้ serialization ล้มเหลว แก้ useDefineForClassFields=false แล้ว browser tests ผ่าน; จัด tsup noExternal ให้รวม shared โดยไม่ให้ production ต้องรัน TypeScript source
