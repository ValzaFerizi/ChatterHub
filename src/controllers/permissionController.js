const { getPermissions, assignPermission, getRolePermissions } = require('../services/permissionService');

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await getPermissions();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionName } = req.body;
    const result = await assignPermission(roleId, permissionName);
    res.status(200).json({ message: 'Permission assigned successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPermissionsForRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const permissions = await getRolePermissions(Number(roleId));
    res.status(200).json({ roleId, permissions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAllPermissions, assignPermissionToRole, getPermissionsForRole };