import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function FeedDetail() {
  const { feedId } = useParams(); // URL에서 feedId 파라미터 가져오기
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/feeds/${feedId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFeed(response.data);
      } catch (error) {
        console.error('피드 상세 정보 로드 실패', error);
      }
    };

    fetchFeedDetail();
  }, [feedId]);

  if (!feed) return <div>Loading...</div>;

  return (
    <div>
      <h2>{feed.title}</h2>
      <img src={feed.image} alt={feed.title} />
      <p>{feed.description}</p>
    </div>
  );
}

export default FeedDetail;
