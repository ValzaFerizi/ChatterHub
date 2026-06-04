const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'user_roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserRole;
