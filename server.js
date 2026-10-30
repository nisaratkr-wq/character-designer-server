// โหลดค่าใน .env
require("dotenv").config();

// ดึง app จาก app.js
const app = require("./app");

// PORT
const PORT = process.env.PORT || 5000;

// เริ่ม Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});