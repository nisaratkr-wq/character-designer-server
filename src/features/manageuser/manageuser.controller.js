const manageUserService = require("./manageuser.service");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await manageUserService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await manageUserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const created = await manageUserService.createUser(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await manageUserService.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await manageUserService.deleteUser(req.params.id);
    if (!result.deleted) return res.status(404).json({ error: "User not found" });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
