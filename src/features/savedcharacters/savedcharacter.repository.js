const connection = require("../../config/db");

function findByUserId(userId) {
  const sql = `
    SELECT id, user_id, character_name, layers, preview_image_url, created_at, updated_at
    FROM saved_characters
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [userId], (err, rows) => {
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

function create(savedCharacterData) {
  const sql = `
    INSERT INTO saved_characters
      (user_id, character_name, layers, preview_image_url)
    VALUES (?, ?, ?, ?)
  `;
  const params = [
    savedCharacterData.user_id,
    savedCharacterData.character_name,
    savedCharacterData.layers,
    savedCharacterData.preview_image_url,
  ];

  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: result.insertId,
          ...savedCharacterData,
          layers: JSON.parse(savedCharacterData.layers),
        });
      }
    });
  });
}

function deleteByIdAndUserId(id, userId) {
  const sql = `
    DELETE FROM saved_characters
    WHERE id = ? AND user_id = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [id, userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({ deleted: result.affectedRows > 0, id, user_id: userId });
      }
    });
  });
}

function updateByIdAndUserId(id, userId, updates) {
  const columns = {
    character_name: "character_name",
    layers: "layers",
    preview_image_url: "preview_image_url",
  };
  const fields = Object.keys(updates).filter((field) => columns[field]);
  const assignments = fields.map((field) => `${columns[field]} = ?`).join(", ");
  const values = fields.map((field) => updates[field]);
  const sql = `
    UPDATE saved_characters
    SET ${assignments}
    WHERE id = ? AND user_id = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [...values, id, userId], (err) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(
        `
          SELECT id, user_id, character_name, layers, preview_image_url,
            created_at, updated_at
          FROM saved_characters
          WHERE id = ? AND user_id = ?
        `,
        [id, userId],
        (selectErr, rows) => {
          if (selectErr) {
            reject(selectErr);
          } else if (rows.length === 0) {
            resolve(null);
          } else {
            resolve({
              ...rows[0],
              layers: JSON.parse(rows[0].layers),
            });
          }
        }
      );
    });
  });
}

function postByIdAndUserId(id, userId, displayName) {
  const saveDisplayName = displayName !== undefined;
  const sql = saveDisplayName
    ? `
        UPDATE saved_characters
        SET posted = TRUE, posted_at = CURRENT_TIMESTAMP, post_display_name = ?
        WHERE id = ? AND user_id = ?
      `
    : `
        UPDATE saved_characters
        SET posted = TRUE, posted_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `;
  const params = saveDisplayName
    ? [displayName, id, userId]
    : [id, userId];

  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else if (!result.affectedRows) {
        resolve(null);
      } else {
        resolve({
          id,
          user_id: userId,
          posted: true,
          ...(saveDisplayName ? { post_display_name: displayName } : {}),
        });
      }
    });
  });
}

module.exports = {
  findByUserId,
  create,
  updateByIdAndUserId,
  deleteByIdAndUserId,
  postByIdAndUserId,
};