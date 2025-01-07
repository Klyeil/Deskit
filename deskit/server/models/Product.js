const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);