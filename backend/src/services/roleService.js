const { findRoleByName, assignRoleToUser, getUserRoles, getAllRoles } = require('../repositories/roleRepository');

const assignRole = async (userId, roleName) => {
  const role = await findRoleByName(roleName);
  if (!role) throw new Error('Role not found');
  return await assignRoleToUser(userId, role.id);
};

const getUserRoleNames = async (userId) => {
  const roles = await getUserRoles(userId);
  return roles.map(role => role.name);
};

const listRoles = async () => {
  return await getAllRoles();
};

module.exports = { assignRole, getUserRoleNames, listRoles };
