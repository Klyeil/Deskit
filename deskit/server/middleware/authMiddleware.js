const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

// 사용자 인증 미들웨어
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY);
    console.log("Decoded Token:", decoded);
    req.user = decoded; // 사용자 정보를 req.user에 저장
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// 역할 검증 미들웨어
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticateUser, verifyRole };