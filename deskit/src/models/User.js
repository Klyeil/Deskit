// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name : { type: String, required: true },
  nickname: { type: String, required: true, unique: true }, // 추가된 필드
  birthday: { type: String, required: true },
  address: { type: String, required: true },
  role : { 
    type: String,
    enum: ['user', 'admin'],
    default: 'user' }
}, { timestamps: true });

// 비밀번호를 저장하기 전에 해시화하는 함수
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// 비밀번호 확인 메서드
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
