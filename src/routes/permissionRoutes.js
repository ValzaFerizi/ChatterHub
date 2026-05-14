const express = require('express');
const router = express.Router();
const { getAllPermissions, assignPermissionToRole, getPermissionsForRole } = require('../controllers/permissionController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.get('/', verifyToken, requireRole('admin'), getAllPermissions);
router.post('/assign', verifyToken, requireRole('admin'), assignPermissionToRole);
router.get('/:roleId', verifyToken, requireRole('admin'), getPermissionsForRole);

module.exports = router;