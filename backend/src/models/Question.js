const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Question = sequelize.define('Question', {
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
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'section_id'
  },
  label: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(
      'short_answer',
      'paragraph',
      'multiple_choice',
      'checkboxes',
      'dropdown',
      'file_upload',
      'linear_scale',
      'multiple_choice_grid',
      'checkbox_grid',
      'date',
      'time'
    ),
    allowNull: false
  },
  placeholder: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  helpText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'help_text'
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_required'
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'order_index'
  },
  validationRules: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'validation_rules'
  }
}, {
  tableName: 'questions',
  timestamps: true,
  underscored: true
});

module.exports = Question;