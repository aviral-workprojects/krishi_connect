'use strict';
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize'); // ✅ import DataTypes
const configAll = require('../config/db');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = configAll[env];
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    // ✅ now pass DataTypes into each model
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
  Order.belongsToMany(Crop, { through: OrderItem, foreignKey: 'orderId', otherKey: 'cropId', as: 'items' });
  Crop.belongsToMany(Order, { through: OrderItem, foreignKey: 'cropId', otherKey: 'orderId' });

  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  OrderItem.belongsTo(Crop, { foreignKey: 'cropId' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
