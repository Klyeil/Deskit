const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true } // createdAt, updatedAt 자동 추가
);

module.exports = mongoose.model('Feed', FeedSchema);
