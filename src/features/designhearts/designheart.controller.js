const designHeartService = require("./designheart.service");

exports.getDesignHeart = async (req, res) => {
  try {
    const designHeart = await designHeartService.getDesignHearts(req.query);

    if (!designHeart) {
      return res.status(404).json({ error: "Heart record not found" });
    }

    res.json(designHeart);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};

exports.deleteDesignHeart = async (req, res) => {
  try {
    const result = await designHeartService.deleteDesignHeart(req.query);

    if (!result.deleted) {
      return res.status(404).json({ error: "Heart record not found" });
    }

    res.json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};

exports.createDesignHeart = async (req, res) => {
  try {
    const designHeart = await designHeartService.createDesignHeart(req.body);
    res.status(201).json(designHeart);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};