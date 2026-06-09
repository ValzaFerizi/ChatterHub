const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const LoginAttempt = sequelize.define('LoginAttempt', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false },
  ip_address: { type: DataTypes.STRING, allowNull: true },
  success: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'login_attempts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = LoginAttempt;
