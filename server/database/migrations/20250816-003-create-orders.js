'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      buyer_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }, onDelete: 'CASCADE'
      },
      total_amount: { type: Sequelize.INTEGER, allowNull: false }, // paise
      currency: { type: Sequelize.STRING, allowNull: false, defaultValue: 'INR' },
      status: { type: Sequelize.ENUM('created','paid','failed','cancelled'), allowNull: false, defaultValue: 'created' },
      razorpay_order_id: { type: Sequelize.STRING },
      razorpay_payment_id: { type: Sequelize.STRING },
      razorpay_signature: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_status";');
  }
};
