const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');  // 미들웨어 경로

router.get('/admin/dashboard', authorize(['admin']), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;
