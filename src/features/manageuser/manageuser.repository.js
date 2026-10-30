const connection = require("../../config/db");

function findAll() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users ORDER BY id DESC", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0] || null);
    });
  });
}

function create(userData) {
  const username = String(userData.username).trim();

  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO users (username) VALUES (?)", [username], (err, result) => {
      if (err) reject(err);
      else resolve({ id: result.insertId, username });
    });
  });
}

function update(id, userData) {
  const username = String(userData.username).trim();

  return new Promise((resolve, reject) => {
    connection.query("UPDATE users SET username = ? WHERE id = ?", [username, id], (err, result) => {
      if (err) reject(err);
      else if (result.affectedRows === 0) resolve(null);
      else resolve({ id: Number(id), username });
    });
  });
}

function deleteById(id) {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      else resolve({ deleted: result.affectedRows > 0, id: Number(id) });
    });
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById,
};
