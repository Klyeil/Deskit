const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateUser } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 제품 목록 가져오기
router.get('/list', async (req, res) => {
  try {
    const products = await Product.find().populate('category company'); // 카테고리와 회사를 포함하여 가져옴
    res.status(200).json(products);
  } catch (error) {
    console.error('제품 목록 가져오기 오류:', error);
    res.status(500).json({ message: '제품 목록을 가져올 수 없습니다.', error });
  }
});

// 제품 추가 라우트
router.post('/add', authenticateUser, upload.single('image'), async (req, res) => {
  const { name, price, company, category, description, stock } = req.body;

  if (!name || !price || !company || !category || !description || !stock || !req.file) {
    return res.status(400).json({ message: '모든 필드를 채워주세요.' });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      company,
      category,
      description,
      stock,
      image: `/uploads/${req.file.filename}`,
    });

    await newProduct.save();
    res.status(201).json({ message: '제품이 성공적으로 등록되었습니다.', product: newProduct });
  } catch (error) {
    console.error('제품 등록 오류:', error);
    res.status(500).json({ message: '제품 등록 실패', error });
  }
});

router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate('category company');
    if (!product) {
      return res.status(404).json({ message: '제품을 찾을 수 없습니다.' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('제품 상세 정보 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류로 인해 제품을 가져올 수 없습니다.', error });
  }
});

module.exports = router;

