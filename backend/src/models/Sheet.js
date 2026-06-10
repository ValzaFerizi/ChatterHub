const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Sheet = sequelize.define('Sheet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  formId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'form_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Untitled Sheet'
  },
  cells: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by'
  }
}, {
  tableName: 'sheets',
  timestamps: true,
  underscored: true
})

module.exports = Sheet