const { 
  getAllPermissions, 
  findPermissionByName, 
  assignPermissionToRole, 
  getPermissionsByRole 
} = require('../repositories/permissionRepository');

const getPermissions = () => {
  return getAllPermissions();
};

const assignPermission = (roleId, permissionName) => {
  const permission = findPermissionByName(permissionName);
  if (!permission) throw new Error('Permission not found');
  return assignPermissionToRole(roleId, permission.id);
};

const getRolePermissions = (roleId) => {
  return getPermissionsByRole(roleId);
};

module.exports = { getPermissions, assignPermission, getRolePermissions };