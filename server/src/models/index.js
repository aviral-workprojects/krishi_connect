'use strict';
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Render / production
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
  });
} else {
  // Local dev
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );
}

const db = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Associations
const { User, Crop, Order, OrderItem } = db;

if (User && Crop) {
  User.hasMany(Crop, { foreignKey: 'farmerId', as: 'crops' });
  Crop.belongsTo(User, { foreignKey: 'farmerId', as: 'farmer' });
}

if (User && Order) {
  User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });
  Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
}

if (Order && Crop && OrderItem) {
  Order.belongsToMany(Crop, {
    through: OrderItem,
    foreignKey: 'orderId',
    otherKey: 'cropId',
    as: 'items'
  });
  Crop.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'cropId',
    otherKey: 'orderId'
  });

  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  OrderItem.belongsTo(Crop, { foreignKey: 'cropId' });
}

console.log("Loaded models:", Object.keys(db)); // debug

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
