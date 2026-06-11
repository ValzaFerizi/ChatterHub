const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Kërkohet roli Admin' });
  }
  next();
};

module.exports = { requireAdmin };