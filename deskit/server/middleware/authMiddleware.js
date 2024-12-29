const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    req.user = decoded; // 사용자 정보를 req.user에 저장
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser };