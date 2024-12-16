import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/FeedDetailPage.css';

const FeedDetailPage = () => {
  const { feedId } = useParams(); // URL 파라미터에서 feedId를 가져옴
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching feed with feedId: ${feedId}`); // feedId가 올바르게 전달되는지 확인
    const fetchFeedDetail = async () => {
      if (!feedId) {
        console.error('Feed ID is missing');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3001/feeds/${feedId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data); // 응답 확인
          setFeed(data); // 피드 상세 정보 저장
        } else {
          console.error('Failed to fetch feed detail');
        }
      } catch (error) {
        console.error('Error fetching feed detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedDetail();
  }, [feedId]); // feedId가 변경될 때마다 새로 호출

  // feed 상태가 변경될 때마다 콘솔에 출력
  useEffect(() => {
    if (feed !== null) {
      console.log('Fetched feed:', feed); // 상태 업데이트 후 feed가 잘 저장되었는지 확인
    }
  }, [feed]); // feed 상태가 변경될 때마다 실행

  return (
    <div className="feed-detail-page">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="feed-detail-container">
          {feed ? (
            <div className="feed-detail-item">
              <img src={feed.image} alt="Feed" className="feed-detail-image" />
              <p className="feed-description">{feed.description}</p>
            </div>
          ) : (
            <p>Feed not found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedDetailPage;
