'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch users (customers only)
    const users = await queryInterface.sequelize.query(
      `SELECT id, role FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const customers = users.filter(u => u.role === 'customer');

    if (customers.length === 0) {
      throw new Error('No customers found! Seed users first.');
    }

    // Insert orders for customer id = 2 (for example)
    await queryInterface.bulkInsert('orders', [
      {
        customer_id: customers[0].id,
        total_price: 500,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        customer_id: customers[0].id,
        total_price: 300,
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
