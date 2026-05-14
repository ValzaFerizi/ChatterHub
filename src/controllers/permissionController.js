const { getPermissions, assignPermission, getRolePermissions } = require('../services/permissionService');

const getAllPermissions = async (req, res) => {
  try {
    const permissions = getPermissions();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionName } = req.body;
    const result = assignPermission(roleId, permissionName);
    res.status(200).json({ message: 'Permission assigned successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPermissionsForRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const permissions = getRolePermissions(Number(roleId));
    res.status(200).json({ roleId, permissions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAllPermissions, assignPermissionToRole, getPermissionsForRole };