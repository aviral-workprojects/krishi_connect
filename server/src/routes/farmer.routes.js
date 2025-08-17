const router = require('express').Router();
const ctrl = require('../controllers/farmer.controller');
const auth = require('../middlewares/auth');

// ✅ Simple demo/test route
router.get("/", (req, res) => {
  res.json({ message: "Farmers API working 🚜" });
});

// Farmer creates a new crop (requires auth)
router.post('/crops', auth('farmer'), ctrl.createCrop);

// Farmer lists their crops (requires auth)
router.get('/crops', auth('farmer'), ctrl.listMyCrops);

module.exports = router;
