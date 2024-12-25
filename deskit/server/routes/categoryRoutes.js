const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 카테고리 스키마 및 모델 정의
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Category = mongoose.model('Category', categorySchema);

// 카테고리 추가 API
router.post('/add', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: '카테고리 이름은 필수입니다.' });
  }

  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({ message: '카테고리 추가 성공!', category: newCategory });
  } catch (error) {
    res.status(500).json({ message: '서버 오류로 인해 추가 실패', error });
  }
});

// 카테고리 목록 가져오기 API
router.get('/list', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: '서버 오류로 인해 목록 가져오기 실패', error });
  }
});

// 카테고리 삭제 API
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: '카테고리 삭제 성공' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류로 인해 삭제 실패', error });
  }
});

// 카테고리 수정 API
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: '카테고리 이름은 필수입니다.' });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true } // 수정된 문서를 반환
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '카테고리 수정 성공', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: '서버 오류로 인해 수정 실패', error });
  }
});

module.exports = router;