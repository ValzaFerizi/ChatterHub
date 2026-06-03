const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const QuestionOption = sequelize.define('QuestionOption', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_id'
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'order_index'
  }
}, {
  tableName: 'question_options',
  timestamps: true,
  underscored: true
});

module.exports = QuestionOption;