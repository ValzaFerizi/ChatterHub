const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FormCollaborator = sequelize.define('FormCollaborator', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  role: {
    type: DataTypes.ENUM('viewer', 'editor', 'owner'),
    allowNull: false,
    defaultValue: 'viewer'
  }
}, {
  tableName: 'form_collaborators',
  timestamps: true,
  underscored: true
});

module.exports = FormCollaborator;