const { getUserRoles } = require('../repositories/roleRepository');

const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const userRoles = await getUserRoles(userId);
    const roleNames = userRoles.map(role => role.name);

    const hasRole = allowedRoles.some(role => roleNames.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Access denied - insufficient permissions' });
    }
    next();
  };
};

module.exports = { requireRole };