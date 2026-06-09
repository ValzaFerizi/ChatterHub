const express = require('express');
const router = express.Router();
const { search } = require('../controllers/searchController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, search);

module.exports = router;
