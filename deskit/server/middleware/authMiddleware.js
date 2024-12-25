const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    try {
      const tokenWithoutBearer = token.split(' ')[1];
      const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied, insufficient role' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = { verifyRole };