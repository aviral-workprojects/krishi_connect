const router = require('express').Router();
const ctrl = require('../controllers/farmer.controller');
const auth = require('../middlewares/auth');

router.post('/crops', auth('farmer'), ctrl.createCrop);
router.get('/crops', auth('farmer'), ctrl.listMyCrops);

module.exports = router;
