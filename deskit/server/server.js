const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;  // 환경 변수에서 비밀 키 로드

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});

// 사용자 모델 정의 (이름, 생일, 주소 추가)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },        // 이름 추가
    birthday: { type: Date, required: true },      // 생일 추가
    address: { type: String, required: true },      // 주소 추가
});

const User = mongoose.model('User', UserSchema);

// 로그인 라우트
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 이메일로 사용자 찾기
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 비밀번호 비교 (bcrypt로 해싱된 비밀번호와 비교)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ email: user.email, userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// 회원가입 라우트
app.post('/signup', async (req, res) => {
    const { email, password, name, birthday, address } = req.body;

    try {
        // 필수 필드 검사
        if (!email || !password || !name || !birthday || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 이미 이메일이 존재하는지 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 새 사용자 저장 (이름, 생일, 주소 포함)
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            birthday,
            address,
        });
        await newUser.save();

        // JWT 토큰 생성
        const token = jwt.sign({ email: newUser.email, userId: newUser._id }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ token, message: 'Signup successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
