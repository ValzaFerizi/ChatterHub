const permissions = [
  { id: 1, name: 'create_user', description: 'Can create users' },
  { id: 2, name: 'delete_user', description: 'Can delete users' },
  { id: 3, name: 'view_logs', description: 'Can view audit logs' },
  { id: 4, name: 'manage_roles', description: 'Can manage roles' },
  { id: 5, name: 'view_users', description: 'Can view all users' }
];

const rolePermissions = [];

const getAllPermissions = () => permissions;

const findPermissionByName = (name) => {
  return permissions.find(p => p.name === name);
};

const assignPermissionToRole = (roleId, permissionId) => {
  rolePermissions.push({ roleId, permissionId });
  return { roleId, permissionId };
};

const getPermissionsByRole = (roleId) => {
  return rolePermissions
    .filter(rp => rp.roleId === roleId)
    .map(rp => permissions.find(p => p.id === rp.permissionId));
};

module.exports = { 
  getAllPermissions, 
  findPermissionByName, 
  assignPermissionToRole, 
  getPermissionsByRole 
};