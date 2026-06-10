const { Role, UserRole, User } = require('../models');

const findRoleByName = async (name) => {
  return await Role.findOne({ where: { name } });
};

const findRoleById = async (id) => {
  return await Role.findByPk(id);
};

const getAllRoles = async () => {
  return await Role.findAll();
};

const assignRoleToUser = async (userId, roleId) => {
  return await UserRole.create({ user_id: userId, role_id: roleId });
};

const getUserRoles = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ association: 'roles' }]
  });
  return user ? user.roles : [];
};

module.exports = { findRoleByName, findRoleById, getAllRoles, assignRoleToUser, getUserRoles };
