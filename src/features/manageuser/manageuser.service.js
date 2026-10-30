const manageUserRepository = require("./manageuser.repository");

function validateUserId(id) {
  if (!/^[1-9]\d*$/.test(String(id)) || Number(id) > 2147483647) {
    throw new Error("Invalid user id");
  }
}

async function getAllUsers() {
  return await manageUserRepository.findAll();
}

async function getUserById(id) {
  validateUserId(id);
  return await manageUserRepository.findById(id);
}

async function createUser(userData) {
  if (!userData || !userData.username || !String(userData.username).trim()) {
    throw new Error("username is required");
  }

  return await manageUserRepository.create(userData);
}

async function updateUser(id, userData) {
  validateUserId(id);
  if (!userData || !userData.username || !String(userData.username).trim()) {
    throw new Error("username is required");
  }

  return await manageUserRepository.update(id, userData);
}

async function deleteUser(id) {
  validateUserId(id);
  return await manageUserRepository.deleteById(id);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
