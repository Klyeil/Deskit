import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart, AiOutlineInfoCircle } from 'react-icons/ai';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { useUser } from '../context/UserContext';
import '../styles/FeedDetailPage.css';
import ProductList from './ProductList'; // 제품 정보 컴포넌트

const FeedDetailPage = () => {
  const { feedId } = useParams();
  const { user, loading: userLoading } = useUser(); // 사용자 데이터와 로딩 상태
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [saved, setSaved] = useState(false); // 저장 상태
  const [showProductInfo, setShowProductInfo] = useState(false); // 제품 정보 토글 상태

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
    setLiked((prev) => !prev);
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    setSaved((prev) => !prev);
  };

  // 제품 정보 토글 핸들러
  const toggleProductInfo = () => {
    setShowProductInfo((prev) => !prev);
  };

  return (
    <div className="feed-detail-page">
      {loading || userLoading ? (
        <p>Loading...</p>
      ) : feed ? (
        <div className="feed-layout">
          {/* 중앙의 피드 상세 정보 */}
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
                <span className="user-nickname">@ {user ? user.nickname : 'Unknown User'}</span>
              </div>
            </div>

            {/* 이미지 섹션 */}
            <div className="feed-image-section">
              <img src={feed.image} alt="Desk Setup" className="feed-main-image" />
              <div className="product-info-icon" onClick={toggleProductInfo}>
                <AiOutlineInfoCircle size={24} />
              </div>
            </div>

            {/* 좋아요 및 저장 아이콘 */}
            <div className="feed-actions">
              <div className="like-icon" onClick={handleLike}>
                {liked ? <AiFillHeart color="#7655E3" size={24} /> : <AiOutlineHeart color="gray" size={24} />}
              </div>
              <div className="save-icon" onClick={handleSave}>
                {saved ? <MdBookmark color="#7655E3" size={24} /> : <MdBookmarkBorder color="gray" size={24} />}
              </div>
            </div>

          </div>

          {/* 오른쪽 제품 정보 섹션 */}
          {showProductInfo && (
            <div className="product-info-sidebar">
              <ProductList products={feed.products} />
            </div>
          )}
        </div>
      ) : (
        <p>Feed not found</p>
      )}
    </div>
  );
};

export default FeedDetailPage;