const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Form = sequelize.define('Form', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'owner_id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Untitled form'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_published'
  }
}, {
  tableName: 'forms',
  timestamps: true,
  underscored: true
});

module.exports = Form;