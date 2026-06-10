const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  token: { type: DataTypes.STRING(512), allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  used_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'password_reset_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PasswordResetToken;
