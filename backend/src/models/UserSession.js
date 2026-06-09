const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UserSession = sequelize.define('UserSession', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  token: { type: DataTypes.STRING(512), allowNull: false },
  ip_address: { type: DataTypes.STRING, allowNull: true },
  user_agent: { type: DataTypes.STRING, allowNull: true },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'user_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserSession;
