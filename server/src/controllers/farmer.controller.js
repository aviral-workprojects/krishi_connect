const { Crop } = require('../models');

exports.createCrop = async (req, res, next) => {
  try {
    const { name, quantityKg, pricePerKg, location } = req.body;
    if (!name || !quantityKg || !pricePerKg || !location) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const crop = await Crop.create({
      name, quantityKg, pricePerKg, location, farmerId: req.user.id
    });
    res.status(201).json(crop);
  } catch (e) { next(e); }
};

exports.listMyCrops = async (req, res, next) => {
  try {
    const crops = await Crop.findAll({ where: { farmerId: req.user.id }, order: [['id','DESC']] });
    res.json(crops);
  } catch (e) { next(e); }
};
