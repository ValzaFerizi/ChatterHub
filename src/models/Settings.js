const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'settings',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at'
});

module.exports = Settings;
