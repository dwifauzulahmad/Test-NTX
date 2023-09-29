const jwt = require('jsonwebtoken');

// Middleware untuk autentikasi JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, statusCode: 401, error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, statusCode: 401, error: 'Invalid token' });
  }
};

// Middleware untuk membatasi endpoint berdasarkan role user
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (userRole !== requiredRole) {
      return res.status(403).json({ success: false, statusCode: 403, error: 'Forbidden' });
    }

    next();
  };
};

// Gunakan middleware authentikasi pada endpoint tertentu
app.get('/protected', authMiddleware, (req, res) => {
  // ...
});

// Gunakan middleware role pada endpoint tertentu
app.get('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => {
  // ...
});
