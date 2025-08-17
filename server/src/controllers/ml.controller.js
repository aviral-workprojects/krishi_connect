const axios = require("axios");

const ML_API_URL = process.env.ML_API_URL || "http://localhost:5000";

// Farmer requests crop recommendation (actually crop price prediction)
exports.getCropRecommendation = async (req, res) => {
  try {
    const {
      crop,
      soil_type,
      season,
      rainfall_mm,
      temperature_c,
      demand_index
    } = req.body;

    // Validate input
    if (!crop || !soil_type || !season || rainfall_mm === undefined || temperature_c === undefined || demand_index === undefined) {
      return res.status(400).json({
        error: "Missing required fields. Expected { crop, soil_type, season, rainfall_mm, temperature_c, demand_index }"
      });
    }

    // Call ML API
    const response = await axios.post(`${ML_API_URL}/recommend`, {
      crop,
      soil_type,
      season,
      rainfall_mm,
      temperature_c,
      demand_index
    });

    return res.json(response.data);
  } catch (error) {
    console.error("ML API Error (recommend):", error.message);
    res.status(500).json({ error: "Failed to fetch crop recommendation" });
  }
};

// Buyer sees predicted market trends
exports.getMarketTrends = async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/trends`);
    return res.json(response.data);
  } catch (error) {
    console.error("ML API Error (trends):", error.message);
    res.status(500).json({ error: "Failed to fetch market trends" });
  }
};
