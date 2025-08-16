const axios = require("axios");

// Read ML service URL from .env (fallback to localhost for dev)
const ML_API_URL = process.env.ML_API_URL || "http://localhost:5000";

exports.getCropRecommendation = async (req, res) => {
  try {
    const { soilType, season, rainfall } = req.body;

    const response = await axios.post(`${ML_API_URL}/recommend`, {
      soilType,
      season,
      rainfall
    });

    return res.json(response.data);
  } catch (error) {
    console.error("ML API Error (recommend):", error.message);
    res.status(500).json({ error: "Failed to fetch crop recommendation" });
  }
};

exports.getMarketTrends = async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/trends`);
    return res.json(response.data);
  } catch (error) {
    console.error("ML API Error (trends):", error.message);
    res.status(500).json({ error: "Failed to fetch market trends" });
  }
};
