const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ResponseAnswer = sequelize.define('ResponseAnswer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  responseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'response_id'
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_id'
  },
  valueText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'value_text'
  },
  valueNumber: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'value_number'
  },
  valueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'value_date'
  },
  valueJson: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'value_json'
  }
}, {
  tableName: 'response_answers',
  timestamps: true,
  updatedAt: false,
  underscored: true
});

module.exports = ResponseAnswer;