const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// 회사별 제품 목록 가져오기
router.get('/company/:companyId', async (req, res) => {
    const { companyId } = req.params;
    console.log('Received companyId:', companyId); // 디버깅

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: '유효하지 않은 회사 ID입니다.' });
    }
  
    try {
      const products = await Product.find({ company: companyId }).populate('category', 'name');
      console.log('Fetched products:', products); // 디버깅
      if (!products.length) {
        return res.status(200).json([]);
      }
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: '서버 오류로 인해 제품을 가져올 수 없습니다.', error });
    }
  });


// 새 제품 추가
router.post('/add', async (req, res) => {
    const { name, company, category, price } = req.body;
  
    if (!name || !company || !category || !price) {
      return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
    }
  
    try {
      const newProduct = new Product({ name, company, category, price });
      await newProduct.save();
      res.status(201).json({ message: '제품이 성공적으로 추가되었습니다!', product: newProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: '서버 오류로 인해 제품 추가에 실패했습니다.', error });
    }
  });

// 제품 필터링 라우트
router.get('/filter', async (req, res) => {
    const { company, category } = req.query;
  
    if (!company || !category) {
      return res.status(400).json({ message: '회사와 카테고리는 필수입니다.' });
    }
  
    try {
      const products = await Product.find({ company, category });
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      res.status(500).json({ message: '서버 오류로 인해 제품을 가져올 수 없습니다.', error });
    }
  });

module.exports = router;