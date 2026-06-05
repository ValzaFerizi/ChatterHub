const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, authLimiter } = require('../middleware/validationMiddleware');

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', verifyToken, logoutUser);
router.get('/me', verifyToken, getProfile);

module.exports = router;
