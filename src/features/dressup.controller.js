const db = require("../../database/db");

// ดึงตัวละครทั้งหมด
const getCharacters = (req, res) => {
  const sql = "SELECT * FROM characters";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

module.exports = {
  getCharacters,
};