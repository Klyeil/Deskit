const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // 업로드된 시간 필드
});

module.exports = mongoose.model('Feed', feedSchema);

