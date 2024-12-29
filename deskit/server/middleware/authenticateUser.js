const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
        console.log('No token provided');
      return res.status(403).json({ message: 'No token provided' });
    }
  
    try {
      const tokenWithoutBearer = token.split(' ')[1]; // 'Bearer' 제거
      const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY); // SECRET_KEY로 검증
      console.log('Decoded Token:', decoded);
      req.user = decoded; // 사용자 정보를 req.user에 저장
      next(); // 다음 미들웨어로 이동
    } catch (error) {
      console.error('Authentication Error:', error.message);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

module.exports = { verifyRole, authenticateUser };