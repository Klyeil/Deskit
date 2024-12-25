const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', require: true }, // 회사
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', require: true }, // 카테고리
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // 제품 ID
        productName: { type: String, required: true }, // 제품 이름
        price: { type: Number, required: true }, // 제품 가격
      },
    ], // 피드에 포함된 여러 제품 정보
  },
  { timestamps: true } // createdAt, updatedAt 자동 추가
);

module.exports = mongoose.model('Feed', FeedSchema);
