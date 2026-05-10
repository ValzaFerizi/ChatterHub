const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);

router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Protected route!', user: req.user });
});

module.exports = router;