const express = require('express');
const router = express.Router();
const { assignRoleToUser, getUserRoles } = require('../controllers/roleController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/assign', verifyToken, assignRoleToUser);
router.get('/:userId', verifyToken, getUserRoles);

module.exports = router;