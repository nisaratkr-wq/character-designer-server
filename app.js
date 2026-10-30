// src/app.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const connection = require("./src/config/db");

// routes
const characterRoutes = require("./src/features/characters/character.routes");
const manageUserRoutes = require("./src/features/manageuser/manageuser.routes");
const savedCharacterRoutes = require("./src/features/savedcharacters/savedcharacter.routes");
const designHeartRoutes = require("./src/features/designhearts/designheart.routes");

const app = express();


// เปิดใช้งาน CORS
app.use(cors());


// รับ JSON
app.use(express.json({ limit: "10mb" }));


// เปิด folder uploads ให้ frontend เข้าถึงได้
const serverUploadsRoot = path.resolve(__dirname, "uploads");
const cmsUploadsRoot = "C:\\cms\\uploads";

app.use("/uploads", express.static(serverUploadsRoot));
app.use("/uploads", express.static(cmsUploadsRoot));


// Routes หลัก
app.get("/api/popular-characters", (req, res) => {
  const sql = `
    SELECT
      COALESCE(image_record.image_id, CONCAT('saved-', saved_characters.id)) AS id,
      saved_characters.id AS saved_character_id,
      COALESCE(saved_characters.preview_image_url, image_record.image_url) AS image_url,
      COALESCE(image_record.created_at, saved_characters.posted_at, saved_characters.created_at) AS created_at,
      COALESCE(heart_counts.likes, 0) AS likes,
      COALESCE(NULLIF(saved_characters.character_name, ''), NULLIF(image_record.title, '')) AS name,
      COALESCE(NULLIF(saved_characters.post_display_name, ''), 'สมาชิก') AS displayName
    FROM saved_characters
    LEFT JOIN image_record
      ON saved_characters.id = image_record.saved_character_id
    LEFT JOIN (
      SELECT saved_character_id, COUNT(*) AS likes
      FROM saved_character_hearts
      GROUP BY saved_character_id
    ) AS heart_counts
      ON heart_counts.saved_character_id = saved_characters.id
    WHERE saved_characters.posted = 1
    ORDER BY image_record.created_at DESC
  `;

  connection.query(sql, (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(rows);
  });
});

app.get("/api/popular-page", (req, res) => {
  const sql = `
    SELECT
      COALESCE(image_record.image_id, CONCAT('saved-', saved_characters.id)) AS id,
      saved_characters.id AS saved_character_id,
      COALESCE(saved_characters.preview_image_url, image_record.image_url) AS image_url,
      COALESCE(image_record.created_at, saved_characters.posted_at, saved_characters.created_at) AS created_at,
      COALESCE(heart_counts.likes, 0) AS likes,
      COALESCE(NULLIF(saved_characters.character_name, ''), NULLIF(image_record.title, '')) AS name,
      COALESCE(NULLIF(saved_characters.post_display_name, ''), 'สมาชิก') AS displayName
    FROM saved_characters
    LEFT JOIN image_record
      ON saved_characters.id = image_record.saved_character_id
    LEFT JOIN (
      SELECT saved_character_id, COUNT(*) AS likes
      FROM saved_character_hearts
      GROUP BY saved_character_id
    ) AS heart_counts
      ON heart_counts.saved_character_id = saved_characters.id
    WHERE saved_characters.posted = 1
    ORDER BY likes DESC, created_at DESC
  `;

  connection.query(sql, (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(rows);
  });
});

app.use("/api/characters", characterRoutes);
app.use("/api/manageusers", manageUserRoutes);
app.use("/api/saved-characters", savedCharacterRoutes);
app.use("/api/design-hearts", designHeartRoutes);


// export app
module.exports = app;