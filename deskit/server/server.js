const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;  // 환경 변수에서 비밀 키 로드

// Feed 모델 추가
const FeedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Feed = mongoose.model('Feed', FeedSchema);


// 이미지 저장 경로 초기화 (uploads 폴더 생성)
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath); // 경로가 존재하지 않으면 생성
}

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadPath));

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// 사용자 모델 정의 (이름, 생일, 주소 추가)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    nickname: { type: String, required: true },
    birthday: { type: Date, required: true },
    address: { type: String, required: true },
    profileImage: { type: String },
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

        // 비밀번호 비교
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
    const { email, password, name, nickname, birthday, address } = req.body;

    try {
        // 필수 필드 검사
        if (!email || !password || !name || !nickname || !birthday || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 이미 이메일이 존재하는지 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
        }

        // 닉네임 중복 검사
        const existingUserByNickName = await User.findOne({ nickname });
        if (existingUserByNickName) {
            return res.status(400).json({ message: '이미 존재하는 사용자명입니다.' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 새 사용자 저장
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            nickname,
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

// 사용자 프로필 라우트 (인증된 사용자만 접근)
app.get('/profile', async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const tokenWithoutBearer = token.split(' ')[1];
        // JWT 토큰 검증
        const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

        // 사용자 정보 조회
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            birthday: user.birthday.toISOString().split('T')[0],
            address: user.address,
            profileImage: user.profileImage,
        });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: '토큰이 만료되었습니다. 다시 로그인하세요.' });
      }
      res.status(401).json({ message: 'Invalid or expired token' });
    }
});

// 이미지 저장 경로 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명에 타임스탬프 추가
  }
});

// multer 설정
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
    cb(null, true);
  }
});

// 프로필 업데이트 라우트 (이미지 파일 처리 추가)
app.put('/profile/update', upload.single('profileImage'), async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    const { name, nickname, birthday, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        name, 
        nickname, 
        birthday, 
        address, 
        profileImage: req.file ? `/uploads/${req.file.filename}` : undefined 
      },
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully!',
      user: {
        name: updatedUser.name,
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        birthday: updatedUser.birthday.toISOString().split('T')[0],
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
      }
    });
  } catch (error) {
    res.status(500).json({ message: '프로필 업데이트 실패', error });
  }
});

// 피드 라우트
app.get('/feeds', async (req, res) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    // Feed 모델에서 사용자와 관련된 피드 조회
    const feeds = await Feed.find({ userId: decoded.userId });
    res.json(feeds);
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// 비밀번호 확인 라우트
app.post('/verify-password', async (req, res) => {
  const { password } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    console.log('No token provided');
    return res.status(403).json({ message: 'No token provided' });
  }

  console.log('Received token:', token);

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({ success: true, message: 'Password verified' });
    } else {
      console.log('Incorrect password');
      res.status(400).json({ success: false, message: 'Incorrect password' });
    }
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// 회원 정보 설정 라우트
app.put('/settings', async (req, res) => {
  const { name, nickname, birthday, address } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { name, nickname, birthday, address },
      { new: true }
    );

    res.json({
      message: 'Settings updated successfully!',
      user: {
        name: updatedUser.name,
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        birthday: updatedUser.birthday.toISOString().split('T')[0],
        address: updatedUser.address,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 피드 업로드 라우트
app.post('/feeds/upload', upload.single('image'), async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    const { title, description } = req.body;
    const userId = decoded.userId;

    if (!title || !req.file) {
      return res.status(400).json({ message: 'Title and image are required' });
    }

    // 절대 경로로 이미지 URL 설정
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;

    const newFeed = new Feed({
      userId,
      title,
      description,
      image: imageUrl,  // 절대 경로로 저장된 이미지 URL
    });

    await newFeed.save();

    // 업로드 후 새 피드를 포함한 피드 목록 응답
    const feeds = await Feed.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    res.status(201).json({ message: 'Feed uploaded successfully!', feeds });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
