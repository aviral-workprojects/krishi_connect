'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Fetch user IDs dynamically
    const users = await queryInterface.sequelize.query(
      `SELECT id, role FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Pick only farmers
    const farmers = users.filter(u => u.role === 'farmer');

    if (farmers.length === 0) {
      throw new Error('No farmers found! Seed users first.');
    }

    // Use the first farmer’s id
    const farmerId = farmers[0].id;

    await queryInterface.bulkInsert('crops', [
      {
        name: 'Wheat',
        quantity_kg: 100,
        price_per_kg: 25,
        location: 'Delhi',
        farmer_id: farmerId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Rice',
        quantity_kg: 200,
        price_per_kg: 30,
        location: 'Punjab',
        farmer_id: farmerId,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('crops', null, {});
  }
};
