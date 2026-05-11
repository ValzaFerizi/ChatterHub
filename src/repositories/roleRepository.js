const roles = [
  { id: 1, name: 'admin', description: 'Administrator' },
  { id: 2, name: 'user', description: 'Regular User' },
  { id: 3, name: 'manager', description: 'Manager' }
];

const userRoles = [];

const findRoleByName = (name) => {
  return roles.find(role => role.name === name);
};

const assignRoleToUser = (userId, roleId) => {
  userRoles.push({ userId, roleId });
  return { userId, roleId };
};

const getUserRoles = (userId) => {
  return userRoles
    .filter(ur => ur.userId === userId)
    .map(ur => roles.find(r => r.id === ur.roleId));
};

module.exports = { findRoleByName, assignRoleToUser, getUserRoles };