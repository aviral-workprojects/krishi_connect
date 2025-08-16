const { Crop, User } = require('../models');
const { Op } = require('sequelize');

exports.browseCrops = async (req, res, next) => {
  try {
    const { q, location, minPrice, maxPrice } = req.query;
    const where = {};
    if (q) where.name = { [Op.iLike]: `%${q}%` };
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (minPrice || maxPrice) {
      where.pricePerKg = {};
      if (minPrice) where.pricePerKg[Op.gte] = minPrice;
      if (maxPrice) where.pricePerKg[Op.lte] = maxPrice;
    }
    const crops = await Crop.findAll({
      where,
      include: [{ model: User, as: 'farmer', attributes: ['id','name'] }],
      order: [['id','DESC']]
    });
    res.json(crops);
  } catch (e) { next(e); }
};
