-- สร้าง database
CREATE DATABASE IF NOT EXISTS dressup_db;

USE dressup_db;

-- ตาราง users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ตาราง characters สำหรับดีไซน์ตัวละคร
CREATE TABLE IF NOT EXISTS characters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  character_name VARCHAR(255) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ตารางเก็บหัวใจของดีไซน์
CREATE TABLE IF NOT EXISTS design_hearts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  character_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_character_user (character_id, user_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ตารางเก็บตัวละครที่ผู้ใช้บันทึกไว้
CREATE TABLE IF NOT EXISTS saved_characters (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(128) NULL,
  character_name VARCHAR(150) NULL,
  layers TEXT NOT NULL,
  preview_image_url VARCHAR(500) NULL,
  post_display_name VARCHAR(150) NULL,
  posted BOOLEAN NOT NULL DEFAULT FALSE,
  posted_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS saved_character_hearts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  saved_character_id INT NOT NULL,
  user_id VARCHAR(128) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_saved_character_user (saved_character_id, user_id),
  FOREIGN KEY (saved_character_id) REFERENCES saved_characters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- View สำหรับดึงอันดับดีไซน์ยอดนิยม (ใช้ query limit 5 ใน code)
CREATE OR REPLACE VIEW popular_designs AS
SELECT
  c.id AS character_id,
  c.character_name,
  c.image_path,
  u.id AS user_id,
  u.username,
  COUNT(h.id) AS heart_count,
  c.description,
  c.created_at
FROM characters c
JOIN users u ON c.user_id = u.id
LEFT JOIN design_hearts h ON h.character_id = c.id
GROUP BY c.id, c.character_name, c.image_path, u.id, u.username, c.description, c.created_at;
