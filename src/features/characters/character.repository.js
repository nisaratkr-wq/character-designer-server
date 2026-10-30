const connection = require("../../config/db");

console.log("DB Connection:", connection);

function findAll(type) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM characters";
    const params = [];

    if (type) {
      sql += " WHERE type = ?";
      params.push(type);
    }
console.log("Executing SQL:", sql, "with params:", params);
    connection.query(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function findPostedSavedCharacters() {
  const sql = `
    SELECT id, user_id, character_name, layers, preview_image_url,
      created_at, updated_at,
      (
        SELECT COUNT(*)
        FROM saved_character_hearts
        WHERE saved_character_id = saved_characters.id
      ) AS heart_count
    FROM saved_characters
    WHERE posted = 1
    ORDER BY COALESCE(posted_at, created_at) DESC
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map((row) => ({
          ...row,
          layers: JSON.parse(row.layers),
        })));
      }
    });
  });
}

function create(characterData) {
  const sql = `INSERT INTO characters (user_id, character_name, image_path, description) VALUES (?, ?, ?, ?)`;
  const params = [
    characterData.user_id,
    characterData.character_name,
    characterData.image_path,
    characterData.description || null,
  ];

  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({ id: result.insertId, ...characterData });
      }
    });
  });
}

function findTopPopular(limit = 5) {
  const sql = `
    SELECT
      c.id AS character_id,
      c.character_name,
      c.image_path,
      c.description,
      u.id AS user_id,
      u.username,
      COUNT(h.id) AS heart_count
    FROM characters c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN design_hearts h ON h.character_id = c.id
    GROUP BY c.id, c.character_name, c.image_path, c.description, u.id, u.username
    ORDER BY heart_count DESC, c.created_at DESC
    LIMIT ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  findAll,
  findPostedSavedCharacters,
  create,
  findTopPopular,
};