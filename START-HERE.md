# เริ่มเล่นบน Windows

1. ติดตั้ง Node.js รุ่น 24 LTS จาก https://nodejs.org/ (เลือก Windows Installer)
2. คลิกขวา ZIP แล้วเลือก Extract All / แยกทั้งหมด ห้ามเปิดเกมจากภายใน ZIP
3. เปิดโฟลเดอร์ siam-realm ที่แตกออกมา ต้องเห็น package.json และ start-game.cmd
4. ดับเบิลคลิก start-game.cmd สคริปต์จะติดตั้งแพ็กเกจเมื่อรันครั้งแรก จึงต้องต่ออินเทอร์เน็ต
5. รอ terminal แสดง Vite ready และ Game server แล้วเปิด http://localhost:5173
6. เก็บหน้าต่าง terminal ไว้ตลอดที่เล่น กด Ctrl+C เมื่อต้องการหยุด
7. ทดสอบอีกผู้เล่นด้วย Chrome หน้าต่างไม่ระบุตัวตน บนเครื่องเดียวกัน

หาก Windows แสดงคำเตือนก่อนเปิดไฟล์ ให้ตรวจไฟล์สคริปต์ด้วย Notepad ก่อนตัดสินใจเปิด หรือใช้คำสั่งด้านล่างแทน

## หากดับเบิลคลิกไม่สำเร็จ

เปิดโฟลเดอร์โปรเจกต์ใน File Explorer พิมพ์ powershell ในแถบที่อยู่ แล้วกด Enter รันทีละบรรทัด:

```powershell
npm.cmd ci
Copy-Item .env.example .env
npm.cmd run dev
```

ถ้า npm.cmd ไม่พบ ให้ติดตั้ง Node.js และเปิด PowerShell ใหม่ ถ้าคำสั่งมี error ให้คัดลอกข้อความ error มาส่งเพื่อแก้ต่อ

localhost คือคอมพิวเตอร์เครื่องนี้ ไม่ใช่ลิงก์เกมออนไลน์ที่เปิดจากเครื่องไหนก็ได้ การเปิดหน้าต่างหลายคนตามขั้นตอนนี้ยังใช้ server จริงที่กำลังรันในเครื่อง

M1 เปิดเล่นโดยไม่ต้องติดตั้ง Docker/PostgreSQL ได้ เพราะ guest ยังอยู่ในหน่วยความจำ ฐานข้อมูลเป็นโครงสร้างเตรียมสำหรับ M3 อ่าน README.md เมื่อต้องการทดสอบ migration/seed

ทดสอบ build/typecheck และ multiplayer สอง browser contexts บน Linux แล้ว ยังไม่ได้ทดสอบบน Windows จริง หากติดขัดให้ส่งข้อความ terminal โดยไม่ส่งรหัสผ่านหรือค่า secret
