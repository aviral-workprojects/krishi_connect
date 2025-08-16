'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch orders
    const orders = await queryInterface.sequelize.query(
      `SELECT id FROM orders;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Fetch crops
    const crops = await queryInterface.sequelize.query(
      `SELECT id, price_per_kg FROM crops;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (orders.length === 0 || crops.length === 0) {
      throw new Error('Orders or crops not found! Seed them first.');
    }

    // Insert sample order items
    await queryInterface.bulkInsert('order_items', [
      {
        order_id: orders[0].id,
        crop_id: crops[0].id,
        quantity: 10,
        price: crops[0].price_per_kg * 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: orders[0].id,
        crop_id: crops[1].id,
        quantity: 5,
        price: crops[1].price_per_kg * 5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_items', null, {});
  }
};
