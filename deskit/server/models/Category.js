const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true },
    },
    { timestamps: true } // 생성일(createdAt)과 수정일(updatedAt)을 자동 관리
  );

// 이미 정의된 모델이 있는 경우 기존 모델을 사용
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

module.exports = Category;