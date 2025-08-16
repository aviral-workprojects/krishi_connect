const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Crop = sequelize.define('Crop', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    quantityKg: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    pricePerKg: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    farmerId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'crops',
    underscored: true
  });

  return Crop;
};
