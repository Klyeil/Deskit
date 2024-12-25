const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // 회사 참조
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // 카테고리 참조
  price: { type: Number, required: true }, // 가격 필드 추가
});

module.exports = mongoose.model('Product', ProductSchema);