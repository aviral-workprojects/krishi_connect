'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password_hash: 'hashed_password',
        role: 'buyer',   // ✅ changed to buyer
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Farmer Singh',
        email: 'farmer@example.com',
        password_hash: 'hashed_password',
        role: 'farmer',  // ✅ farmer role
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: 'hashed_password',
        role: 'admin',   // ✅ admin role
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
