# สถานะภาพ

ตรวจ repository เริ่มต้นแล้ว ไม่พบไฟล์ใน assets/reference/ หรือ assets/game/; สร้าง directory พร้อม .gitkeep ไว้รับไฟล์ ภาพที่อยู่นอกสองโฟลเดอร์นี้ไม่ได้ถือว่าเป็น reference ที่ผู้ใช้ระบุ และไม่ได้ดึงภาพจากบทสนทนาอื่น

ขาด: concept 4 มุมของ 8 อาชีพ, อาวุธดาบ/โล่ หอก ธนู คทาดอกบัว/กระดิ่ง คทาคริสตัล มีดคู่ สนับมือ คัมภีร์/เป้สาน ทั้ง 3 ระดับ, โพชั่น, อาหาร, tiles เมือง/พื้นที่ล่า และมอนสเตอร์ 2 ชนิด

ภาพสี่มุมเป็น concept เท่านั้น ต้องวาดเฟรมเพิ่ม ทุกอาชีพต้องมี idle 4, walk 8, attack 6, hurt 3, death 6 เฟรม **ต่อทิศทาง** รวม 108 เฟรมต่ออาชีพ / 864 เฟรมสำหรับ 8 อาชีพ นี่คือข้อเสนอสำหรับผลิตภาพ ไม่ใช่จำนวนที่มีแล้ว ใช้ 4 ทิศทาง 96×96 px เท่ากัน จุดยืน (48,79) และขนาดอาวุธไม่ตัดขอบ; export PNG transparent + JSON atlas ชื่อ frame `swordsman/walk/south/0` เป็นต้น แยก weapon overlay ถ้าต้องการเปลี่ยนอุปกรณ์โดยไม่วาด animation ทั้งชุดใหม่

manifest อยู่ assets/manifest.json ระบุ path เป้าหมายและสถานะจริง Renderer M1 วาดด้วย Phaser Graphics และลูกศรแสดงทิศทาง ยังไม่ได้อ่าน atlas; เมื่อภาพพร้อมต้องเพิ่ม loader และแทนการสร้าง container ใน Town ก่อนอ้างว่าเปลี่ยนภาพใช้งานแล้ว สำเนา asset runtime ไป apps/client/public/assets/game/ และตรวจ foot anchor/hitbox ทุก animation โดย collision ยังใช้ข้อมูล server เดิม
