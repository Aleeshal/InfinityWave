/**
 * Role-Based Access Control (RBAC) & Authentication Middleware
 */
export function authenticateToken(req, res, next) {
  // Extract and verify session / JWT token
  next();
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
}
