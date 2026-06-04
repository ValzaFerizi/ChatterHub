const { assignRole, getUserRoleNames, listRoles } = require('../services/roleService');

const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    const result = await assignRole(userId, roleName);
    res.status(200).json({ message: 'Role assigned successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const roles = await getUserRoleNames(userId);
    res.status(200).json({ userId, roles });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await listRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { assignRoleToUser, getUserRoles, getRoles };
