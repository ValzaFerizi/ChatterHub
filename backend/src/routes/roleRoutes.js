const express = require('express');
const router = express.Router();
const { assignRoleToUser, getUserRoles, getRoles } = require('../controllers/roleController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.get('/', verifyToken, requireRole('admin'), getRoles);
router.post('/assign', verifyToken, requireRole('admin'), assignRoleToUser);
router.get('/user/:userId', verifyToken, requireRole('admin'), getUserRoles);

module.exports = router;
