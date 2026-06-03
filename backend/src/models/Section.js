const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  formId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'form_id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'order_index'
  }
}, {
  tableName: 'sections',
  timestamps: true,
  underscored: true
});

module.exports = Section;