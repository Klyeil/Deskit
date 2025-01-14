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
const Feed = require('./models/Feed');
const companyRoutes = require('./routes/companyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes  = require('./routes/productRoutes');
const feedRoutes = require('./routes/feedRoutes');


// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;  // 환경 변수에서 비밀 키 로드

// 이미지 저장 경로 초기화 (uploads 폴더 생성)
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath); // 경로가 존재하지 않으면 생성
}

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  // 클라이언트에서 쿠키나 인증 정보를 보내는 것을 허용
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadPath));  // 파일 경로 설정

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// 사용자 모델 정의 (role 필드 추가)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  birthday: { type: Date, required: true },
  address: { type: String, required: true },
  profileImage: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },  // 기본값 'user'
});

const User = mongoose.model('User', UserSchema);

// 역할 검사 미들웨어
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

    req.user = decoded;  // decoded 정보를 후속 요청에 사용하기 위해 저장
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
};



// 로그인 라우트
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: user.email, userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '6h' });

      res.status(200).json({ token, message: 'Login successful!' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// 회원가입 라우트
app.post('/signup', async (req, res) => {
const { email, password, name, nickname, birthday, address, role } = req.body;

try {
    if (!email || !password || !name || !nickname || !birthday || !address) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const existingUserByNickName = await User.findOne({ nickname });
    if (existingUserByNickName) {
        return res.status(400).json({ message: '이미 존재하는 사용자명입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // role이 없다면 'user'로 기본값 설정
    const newUser = new User({
        email,
        password: hashedPassword,
        name,
        nickname,
        birthday,
        address,
        role: role || 'user',  // role 값을 요청에서 받으면 설정, 없으면 기본값 'user'
    });

    await newUser.save();

    const token = jwt.sign({ email: newUser.email, userId: newUser._id, role: newUser.role }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ token, message: 'Signup successful!' });
} catch (error) {
    res.status(500).json({ message: 'Server error' });
}
});

// 인증 미들웨어 (사용자가 로그인된 상태인지 확인)
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);
    req.user = decoded; // 사용자 정보 저장
    next(); // 다음 미들웨어로 이동
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// 사용자 정보 가져오기
app.get('/user/me', authenticateUser, async (req, res) => {
const user = await User.findById(req.user.userId);
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}
res.json(user);
});


// 관리자만 접근할 수 있는 API 예시
app.get('/admin/dashboard', verifyRole(['admin']), async (req, res) => {
    res.status(200).json({ message: 'Welcome to the admin dashboard', user: req.user });
});

// 일반 사용자만 접근할 수 있는 API 예시
app.get('/user/profile', verifyRole(['user']), async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.status(200).json({
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        birthday: user.birthday.toISOString().split('T')[0],
        address: user.address,
        profileImage: user.profileImage,
    });
});

// 사용자 프로필 라우트
app.get('/profile', async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const tokenWithoutBearer = token.split(' ')[1];
        const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

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
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// multer 설정
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
    cb(null, true);
  }
});

// 프로필 업데이트 라우트 ( 이미지 파일 처리 추가 )
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
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: '프로필 업데이트 실패', error });
  }
});

// 피드 랜덤 라우트
app.use('/feeds', feedRoutes);

// 피드 가져오기 라우트
app.get('/feeds', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    const feeds = await Feed.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    res.json(feeds);
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// 피드 상세 정보 API
app.get('/feeds/:feedId', async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.feedId)
    .populate({
      path: 'products.productId',
      populate: {
        path: 'company',
        select: 'name', // 회사 이름만 가져오기
      },
    });  // 피드 ID로 찾기
    if (!feed) {
      return res.status(404).json({ message: '피드를 찾을 수 없습니다.' });
    }
    res.json(feed);  // 피드 상세 정보 반환
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});



// 사용자 ID로 피드 가져오기
app.get('/feeds/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // userId를 mongoose.Types.ObjectId로 변환
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // userId가 맞는 피드를 찾기
    const feeds = await Feed.find({ userId: userObjectId }).sort({ createdAt: -1 });

    if (!feeds || feeds.length === 0) {
      return res.status(404).json({ message: '피드를 찾을 수 없습니다.' });
    }

    res.json(feeds);
  } catch (error) {
    console.error('Error fetching feeds:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});


// 피드 업로드 라우트
app.post('/feeds/upload', upload.single('image'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File:', req.file);

  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    const { company, category, products } = req.body;

    if (!company || !category || !req.file) {
      return res.status(400).json({
        message: '모든 필드를 채워주세요.',
        missingFields: {
          company: !!company,
          category: !!category,
          image: !!req.file,
          products: !!products,
        },
      });
    }

    // products 파싱
    let parsedProducts;
    try {
      parsedProducts = JSON.parse(products);
    } catch (error) {
      return res.status(400).json({ message: '유효하지 않은 제품 데이터입니다.' });
    }

    if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
      return res.status(400).json({ message: '적어도 하나의 제품을 선택해야 합니다.' });
    }

    // products 데이터 매핑
    const feedProducts = parsedProducts.map((product) => ({
      productId: product._id,
      productName: product.name,
      price: product.price,
    }));

    // 새로운 피드 생성
    const newFeed = new Feed({
      userId: decoded.userId,
      image: `http://localhost:3001/uploads/${req.file.filename}`,
      company,
      category,
      products: feedProducts,
    });

    await newFeed.save();

    res.status(201).json({
      message: 'Feed uploaded successfully!',
      feed: newFeed,
    });
  } catch (error) {
    console.error('Error uploading feed:', error);
    res.status(500).json({ message: '서버 오류로 인해 업로드 실패', error });
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


// 피드 가져오기 라우트 (페이지네이션 추가)
app.get('/feeds', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);

    // 쿼리에서 페이지 번호와 페이지당 항목 수 받기 (기본값 설정)
    const page = parseInt(req.query.page) || 1;  // 기본 페이지 번호 1
    const limit = parseInt(req.query.limit) || 10;  // 페이지당 항목 수 10

    const feeds = await Feed.find({ userId: decoded.userId })
                            .sort({ createdAt: -1 })
                            .skip((page - 1) * limit)  // 페이지 스킵
                            .limit(limit);  // 제한된 개수만 가져오기

    // 총 피드 수 계산
    const totalFeeds = await Feed.countDocuments({ userId: decoded.userId });

    res.json({
      feeds,
      totalPages: Math.ceil(totalFeeds / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// 회사 관리 라우트
app.use('/companies', companyRoutes);

// 카테고리 관리 라우트
app.use('/categories', categoryRoutes);

// 제품 관리 라우트
app.use('/products', productRoutes);

// 로그인 상태 확인 라우트
app.get('/auth/check', authenticateUser, (req, res) => {
  res.status(200).json({ message: 'User is authenticated', user: req.user });
});







// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

