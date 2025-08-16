'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Insert demo users
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Farmer Ram',
        email: 'farmer@example.com',
        password: '$2b$10$CwTycUXWue0Thq9StjUM0uJ8qgk0f2H.3dZlU5sWfL.6qOfTP0w1a', // bcrypt hash for "password123"
        role: 'farmer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Buyer Shyam',
        email: 'buyer@example.com',
        password: '$2b$10$CwTycUXWue0Thq9StjUM0uJ8qgk0f2H.3dZlU5sWfL.6qOfTP0w1a', // bcrypt hash for "password123"
        role: 'buyer',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    // Insert demo crops
    await queryInterface.bulkInsert('crops', [
      {
        name: 'Wheat',
        price: 1200,
        quantity: 100,
        farmerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Rice',
        price: 1500,
        quantity: 200,
        farmerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('crops', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
