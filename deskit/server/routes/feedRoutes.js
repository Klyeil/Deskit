const express = require('express');
const Feed = require('../models/Feed'); // Feed 모델 가져오기
const router = express.Router();

// 랜덤 피드 API (/routes/feedRoutes.js)
router.get('/random', async (req, res) => {
    try {
      const feeds = await Feed.aggregate([{ $sample: { size: 20 } }]); // 랜덤으로 20개의 피드 반환
      const populatedFeeds = await Feed.populate(feeds, {
        path: 'userId',
        select: 'nickname profileImage', // 필요한 필드만 선택
      });
      res.status(200).json(populatedFeeds);
    } catch (error) {
      console.error('Error fetching random feeds:', error);
      res.status(500).json({ message: '서버 오류' });
    }
  });

module.exports = router;