import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/FeedDetail.css';

function FeedDetail() {
  const { feedId } = useParams();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:3001/feeds/${feedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeed(response.data);
        setLoading(false);
      } catch (err) {
        console.error('피드 상세 정보 가져오기 실패:', err);
        setError('피드 정보를 가져오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchFeedDetail();
  }, [feedId, navigate]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="feed-detail-page">
      <div className="feed-detail-container">
        <h2 className="feed-title">{feed.title}</h2>
        <img src={feed.image} alt={feed.title} className="feed-image" />
        <p className="feed-description">{feed.description}</p>

        <div className="feed-actions">
          <button className="like-btn">좋아요</button>
          <button className="save-btn">저장</button>
        </div>
      </div>
    </div>
  );
}

export default FeedDetail;
