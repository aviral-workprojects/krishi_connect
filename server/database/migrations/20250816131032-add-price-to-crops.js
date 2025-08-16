module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('crops', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('crops', 'price');
  }
};
