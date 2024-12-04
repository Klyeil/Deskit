const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your-secret-key';  // JWT 비밀키 (실제로는 환경 변수로 관리하는 것이 좋습니다)

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock user data for demonstration
const users = [
    { email: 'test@example.com', password: '123456' },
];

// Routes
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // 유효한 사용자라면 JWT 토큰 생성
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
