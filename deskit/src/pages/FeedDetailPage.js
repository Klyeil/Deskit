import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useUser } from '../context/UserContext';
import { FiBookmark } from 'react-icons/fi';
import '../styles/FeedDetailPage.css';
import ProductList from './ProductList'; // 새로 만든 컴포넌트 가져오기

const FeedDetailPage = () => {
  const { feedId } = useParams();
  const { user, loading: userLoading } = useUser(); // 사용자 데이터와 로딩 상태
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [saved, setSaved] = useState(false); // 저장 상태
  const [showProductInfo, setShowProductInfo] = useState(false);

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/feeds/${feedId}`);
        if (response.ok) {
          const data = await response.json();
          setFeed(data);
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
  }, [feedId]);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = () => {
    setLiked(!liked);
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <div className="feed-detail-page">
      {loading || userLoading ? (
        <p>Loading...</p>
      ) : feed ? (
        <div className="feed-detail-container">
          {/* 헤더: 사용자 정보 */}
          <div className="feed-header">
             <div className="user-info">
                {user && user.profileImage ? (
                <img
                     src={`http://localhost:3001${user.profileImage}`}
                     alt="Profile"
                     className="user-profile-image"
                />
                ) : (
            <div className="profile-placeholder">No Image</div>
                )}
            <span className="user-nickname">
            @ {user ? user.nickname : 'Unknown User'}
            </span>
            
          </div>
        </div>


          {/* 이미지 섹션 */}
          <div className="feed-image-section">
            <img src={feed.image} alt="Desk Setup" className="feed-main-image" />
          </div>

          {/* 좋아요 및 저장 아이콘 */}
          <div className="feed-actions">
            <div className="like-icon" onClick={handleLike}>
              {liked ? <AiFillHeart color="#7655E3" size={24} /> : <AiOutlineHeart color="gray" size={24} />}
            </div>
            <div className="save-icon" onClick={handleSave}>
            <FiBookmark color={saved ? "#7655E3" : "gray"} size={24} /> {/* saved 상태에 따라 색상 변경 */}
            </div>
          </div>

          {/* 제품 정보 사이드바 */}
          {showProductInfo && <ProductList products={feed.products} />}


          {/* 제품 정보 섹션 */}
          <div className="product-info-section">
            <h3>📋 사용된 제품 정보</h3>
            <ul>
              {feed.products && feed.products.length > 0 ? (
                feed.products.map((product, index) => (
                  <li key={index} className="product-item">
                    <span>{product.name}</span> - <a href={product.link} target="_blank" rel="noopener noreferrer">구매 링크</a>
                  </li>
                ))
              ) : (
                <p>제품 정보가 없습니다.</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>Feed not found</p>
      )}
    </div>
  );
};

export default FeedDetailPage;
