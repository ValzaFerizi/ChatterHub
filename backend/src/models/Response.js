const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Response = sequelize.define('Response', {
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
  respondentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'respondent_id'
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'submitted_at'
  }
}, {
  tableName: 'responses',
  timestamps: true,
  underscored: true
});

module.exports = Response;