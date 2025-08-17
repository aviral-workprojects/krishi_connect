const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    amount: { type: DataTypes.INTEGER, allowNull: false }, // in paise
    currency: { type: DataTypes.STRING, defaultValue: "INR" },
    status: { type: DataTypes.STRING, defaultValue: "created" },
    razorpayOrderId: { type: DataTypes.STRING },
    razorpayPaymentId: { type: DataTypes.STRING },
    razorpaySignature: { type: DataTypes.STRING },
    buyerId: { type: DataTypes.INTEGER, allowNull: false },
    farmerId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'orders',
    underscored: true
  });

  return Order;
};
