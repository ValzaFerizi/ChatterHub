const { Permission, RolePermission, Role } = require('../models');

const getAllPermissions = async () => {
  return await Permission.findAll();
};

const findPermissionByName = async (name) => {
  return await Permission.findOne({ where: { name } });
};

const findPermissionById = async (id) => {
  return await Permission.findByPk(id);
};

const assignPermissionToRole = async (roleId, permissionId) => {
  return await RolePermission.create({ role_id: roleId, permission_id: permissionId });
};

const getPermissionsByRole = async (roleId) => {
  const role = await Role.findByPk(roleId, {
    include: [{ association: 'permissions' }]
  });
  return role ? role.permissions : [];
};

module.exports = {
  getAllPermissions,
  findPermissionByName,
  findPermissionById,
  assignPermissionToRole,
  getPermissionsByRole
};
