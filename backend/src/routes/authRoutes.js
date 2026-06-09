const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser, getProfile, getAllUsers, deactivateUser, updateUserRole } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');
const { validateRegister, validateLogin, authLimiter } = require('../middleware/validationMiddleware');

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', verifyToken, logoutUser);
router.get('/me', verifyToken, getProfile);
router.get('/users', verifyToken, requireRole('admin'), getAllUsers);
router.patch('/users/:id/deactivate', verifyToken, requireRole('admin'), deactivateUser);
router.patch('/users/role', verifyToken, requireRole('admin'), updateUserRole);

module.exports = router;
