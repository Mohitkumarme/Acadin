/**
 * Role-based access control middleware factory.
 * Usage: allowRoles('student', 'industry')
 */
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Allowed roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = { allowRoles };
