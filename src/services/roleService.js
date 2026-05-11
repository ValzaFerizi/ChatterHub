const { findRoleByName, assignRoleToUser, getUserRoles } = require('../repositories/roleRepository');

const assignRole = (userId, roleName) => {
  const role = findRoleByName(roleName);
  if (!role) throw new Error('Role not found');
  return assignRoleToUser(userId, role.id);
};

const getUserPermissions = (userId) => {
  const roles = getUserRoles(userId);
  return roles.map(role => role.name);
};

module.exports = { assignRole, getUserPermissions };