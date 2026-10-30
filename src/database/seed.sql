USE dressup_db;

-- ตัวอย่างผู้ใช้
INSERT IGNORE INTO users (username) VALUES
  ('alice'),
  ('bob'),
  ('carol'),
  ('dave'),
  ('eve');

-- ตัวอย่างดีไซน์ตัวละคร
INSERT IGNORE INTO characters (user_id, character_name, image_path, description) VALUES
  (1, 'นักรบอาคีรา', '/uploads/characters/face/akira.png', 'ดีไซน์สาวนักรบสายไฟต์ติ้ง'),
  (2, 'นางฟ้าเรืองแสง', '/uploads/characters/face/fairy.png', 'ดีไซน์แฟนตาซีพร้อมปีกเรืองแสง'),
  (3, 'นักสืบปริศนา', '/uploads/characters/face/detective.png', 'ดีไซน์ตัวละครสายลับลึกลับ'),
  (4, 'ราชินีดอกไม้', '/uploads/characters/face/flower_queen.png', 'ดีไซน์แฟชั่นกลิ่นอายธรรมชาติ'),
  (5, 'นักผจญภัยทะเลทราย', '/uploads/characters/face/desert_adventurer.png', 'ดีไซน์ตัวละครพร้อมชุดผจญภัย');

-- ตัวอย่างยอดหัวใจ
INSERT IGNORE INTO design_hearts (character_id, user_id) VALUES
  (1, 2),
  (1, 3),
  (1, 4),
  (2, 1),
  (2, 3),
  (3, 1),
  (3, 2),
  (3, 4),
  (3, 5),
  (4, 1),
  (4, 5),
  (5, 2);