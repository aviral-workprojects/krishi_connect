const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('farmer', 'buyer', 'admin'), allowNull: false, defaultValue: 'buyer' }
  }, {
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash') && !user.passwordHash.startsWith('$2')) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      }
    }
  });

  User.prototype.validatePassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
  };

  return User;
};
