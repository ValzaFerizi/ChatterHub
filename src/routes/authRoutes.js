const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, authLimiter } = require('../middleware/validationMiddleware');

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', verifyToken, logoutUser);

router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Protected route!', user: req.user });
});

module.exports = router;