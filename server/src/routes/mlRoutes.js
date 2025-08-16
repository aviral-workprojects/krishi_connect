const express = require("express");
const router = express.Router();
const mlController = require("../controllers/ml.controller");

// Farmer requests crop recommendation
router.post("/recommend", mlController.getCropRecommendation);

// Buyer sees predicted market trends
router.get("/trends", mlController.getMarketTrends);

module.exports = router;

