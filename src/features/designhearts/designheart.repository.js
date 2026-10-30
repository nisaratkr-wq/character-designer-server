const connection = require("../../config/db");

function findByUserAndCharacter(userId, characterId) {
  const sql = `
    SELECT id, character_id, user_id, created_at
    FROM design_hearts
    WHERE user_id = ? AND character_id = ?
    LIMIT 1
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [userId, characterId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0] || null);
      }
    });
  });
}

function findByUserAndSavedCharacter(userId, characterId) {
  const sql = `
    SELECT id, saved_character_id AS character_id, user_id, created_at
    FROM saved_character_hearts
    WHERE user_id = ? AND saved_character_id = ?
    LIMIT 1
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [userId, characterId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0] || null);
      }
    });
  });
}

function deleteByUserAndCharacter(userId, characterId) {
  const sql = `
    DELETE FROM design_hearts
    WHERE user_id = ? AND character_id = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [userId, characterId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          deleted: result.affectedRows > 0,
          user_id: userId,
          character_id: characterId,
        });
      }
    });
  });
}

function deleteByUserAndSavedCharacter(userId, characterId) {
  const sql = `
    DELETE FROM saved_character_hearts
    WHERE user_id = ? AND saved_character_id = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [userId, characterId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          deleted: result.affectedRows > 0,
          user_id: userId,
          character_id: characterId,
        });
      }
    });
  });
}

function create(characterId, userId) {
  const sql = `
    INSERT INTO design_hearts (character_id, user_id)
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [characterId, userId], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          const duplicateError = new Error("This user has already hearted this character");
          duplicateError.statusCode = 409;
          reject(duplicateError);
        } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
          const notFoundError = new Error("Character or user not found");
          notFoundError.statusCode = 404;
          reject(notFoundError);
        } else {
          reject(err);
        }
        return;
      }

      resolve({
        id: result.insertId,
        character_id: characterId,
        user_id: userId,
      });
    });
  });
}

function createForSavedCharacter(characterId, userId) {
  const sql = `
    INSERT INTO saved_character_hearts (saved_character_id, user_id)
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [characterId, userId], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          const duplicateError = new Error("This user has already hearted this character");
          duplicateError.statusCode = 409;
          reject(duplicateError);
        } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
          const notFoundError = new Error("Saved character not found");
          notFoundError.statusCode = 404;
          reject(notFoundError);
        } else {
          reject(err);
        }
        return;
      }

      resolve({
        id: result.insertId,
        character_id: characterId,
        user_id: userId,
      });
    });
  });
}

module.exports = {
  findByUserAndCharacter,
  findByUserAndSavedCharacter,
  deleteByUserAndCharacter,
  deleteByUserAndSavedCharacter,
  create,
  createForSavedCharacter,
};