'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      order_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'orders', key: 'id' }, onDelete: 'CASCADE'
      },
      crop_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'crops', key: 'id' }, onDelete: 'CASCADE'
      },
      quantity_kg: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      price_per_kg: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      line_total_paise: { type: Sequelize.INTEGER, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
  }
};
