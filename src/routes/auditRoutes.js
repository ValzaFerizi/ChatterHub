const express = require('express');
const router = express.Router();
const { getAllLogs, getLogsForUser } = require('../controllers/auditController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.get('/', verifyToken, requireRole('admin'), getAllLogs);
router.get('/:userId', verifyToken, requireRole('admin'), getLogsForUser);

module.exports = router;