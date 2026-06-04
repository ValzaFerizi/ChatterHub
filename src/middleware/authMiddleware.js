const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../services/tokenService');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const validateAuditLog = (req, res, next) => {
  const { action, entity } = req.body;
  if (!action || !entity) {
    return res.status(400).json({ message: 'Action and entity are required' });
  }
  next();
};

module.exports = { verifyToken, validateAuditLog };
