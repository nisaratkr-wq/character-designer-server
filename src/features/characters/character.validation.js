// ตรวจว่าชื่อตัวละครว่างไหม
function validateCharacter(data) {

  if (!data.character_name) {
    throw new Error("character_name is required");
  }

  return {
    character_name: data.character_name.trim(),
  };
}

module.exports = {
  validateCharacter,
};