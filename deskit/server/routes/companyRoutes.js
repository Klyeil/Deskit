const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// 회사 스키마 및 모델 정의
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Company = mongoose.model('Company', companySchema);

// 회사 추가 API
router.post('/add', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: '회사 이름은 필수입니다.' });
  }

  try {
    const newCompany = new Company({ name });
    await newCompany.save();
    res.status(201).json({ message: '회사 추가 성공!', company: newCompany });
  } catch (error) {
    res.status(500).json({ message: '서버 오류로 인해 추가 실패', error });
  }
});

// 회사 목록 가져오기 API
router.get('/list', async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: '서버 오류로 인해 목록 가져오기 실패', error });
  }
});

// 회사 삭제 API
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Company.findByIdAndDelete(id);
    res.status(200).json({ message: '회사 삭제 성공' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류로 인해 삭제 실패', error });
  }
});

module.exports = router;