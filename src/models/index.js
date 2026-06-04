const sequelize = require('../config/sequelize');

const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const RefreshToken = require('./RefreshToken');
const Notification = require('./Notification');
const Settings = require('./Settings');
const Files = require('./Files');

// User <-> Role (many-to-many)
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', as: 'roles' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id', as: 'users' });

// Role <-> Permission (many-to-many)
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', as: 'roles' });

// User -> RefreshTokens (one-to-many)
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> Notifications (one-to-many)
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Files, { foreignKey: 'uploaded_by', as: 'files' });
Files.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Permission,
  RolePermission,
  RefreshToken,
  Notification,
  Settings,
  Files
};
