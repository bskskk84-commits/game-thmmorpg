INSERT INTO class_definitions VALUES
('swordsman','นักดาบ','ดาบและโล่'),('knight','อัศวิน','หอก'),('archer','นักธนู','ธนู'),('healer','ฮีลเลอร์','คทาดอกบัวและกระดิ่ง'),('mage','จอมเวท','คทาคริสตัล'),('rogue','โร้ก','มีดคู่'),('muaythai','นักสู้มวยไทย','ผ้าพันมือและสนับมือ'),('merchant','แม่ค้า','คัมภีร์เวทและเป้สาน')
ON CONFLICT(id) DO NOTHING;
INSERT INTO item_definitions VALUES ('starter_sword','ดาบฝึกหัด','starter','{"class":"swordsman"}'),('small_potion','โพชั่นฟื้นพลัง','starter','{"restoreHp":30}') ON CONFLICT(id) DO NOTHING;
