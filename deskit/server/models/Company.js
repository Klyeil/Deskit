const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// 기존 모델이 존재하면 기존 모델을 사용하고, 없으면 새로 정의
module.exports = mongoose.models.Company || mongoose.model('Company', CompanySchema);