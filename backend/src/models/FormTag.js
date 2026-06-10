const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FormTag = sequelize.define('FormTag', {
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
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tag_id'
  }
}, {
  tableName: 'form_tags',
  timestamps: true,
  underscored: true
});

module.exports = FormTag;