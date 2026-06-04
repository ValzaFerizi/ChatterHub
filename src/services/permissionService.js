const { 
  getAllPermissions, 
  findPermissionByName, 
  assignPermissionToRole, 
  getPermissionsByRole 
} = require('../repositories/permissionRepository');

const getPermissions = async () => {
  return await getAllPermissions();
};

const assignPermission = async (roleId, permissionName) => {
  const permission = await findPermissionByName(permissionName);
  if (!permission) throw new Error('Permission not found');
  return await assignPermissionToRole(roleId, permission.id);
};

const getRolePermissions = async (roleId) => {
  return await getPermissionsByRole(roleId);
};

module.exports = { getPermissions, assignPermission, getRolePermissions };