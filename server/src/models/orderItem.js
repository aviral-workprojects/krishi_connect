const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    cropId: { type: DataTypes.INTEGER, allowNull: false },
    quantityKg: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    pricePerKg: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    lineTotalPaise: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'order_items',
    underscored: true
  });

  return OrderItem;
};
