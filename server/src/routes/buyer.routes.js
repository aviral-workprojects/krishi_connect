const router = require('express').Router();
const ctrl = require('../controllers/buyer.controller');
const auth = require('../middlewares/auth');

// Buyer (and optionally admin/farmer if intentional) can browse crops
router.get('/crops', auth(['buyer','admin','farmer']), ctrl.browseCrops);

module.exports = router;
