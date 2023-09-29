import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'Token Tidak Tersedia' });
  }

  try {
    const decoded = jwt.verify(token, 'fauzul07'); 
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token Tidak Valid' });
  }
};

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role; 
    if (userRole !== requiredRole) {
      return res.status(403).json({ message: 'Akses Ditolak' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };