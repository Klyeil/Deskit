import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart, AiOutlineInfoCircle } from 'react-icons/ai';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { useUser } from '../context/UserContext';
import ProductListModal from './ProductListModal'; // 모달 컴포넌트
import '../styles/FeedDetailPage.css';

const FeedDetailPage = () => {
  const { feedId } = useParams();
  const { user, loading: userLoading } = useUser();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

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

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
  };

  const toggleProductModal = () => {
    setShowProductModal((prev) => !prev);
  };

  return (
    <div className="feed-detail-page">
      {loading || userLoading ? (
        <p>Loading...</p>
      ) : feed ? (
        <div className="feed-layout">
          <div className="feed-detail-container">
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

            <div className="feed-image-section">
              <img src={feed.image} alt="Desk Setup" className="feed-main-image" />
              <div className="product-info-icon" onClick={toggleProductModal}>
                <AiOutlineInfoCircle size={24} />
              </div>
            </div>

            <div className="feed-actions">
              <div className="like-icon" onClick={handleLike}>
                {liked ? <AiFillHeart color="#7655E3" size={24} /> : <AiOutlineHeart color="gray" size={24} />}
              </div>
              <div className="save-icon" onClick={handleSave}>
                {saved ? <MdBookmark color="#7655E3" size={24} /> : <MdBookmarkBorder color="gray" size={24} />}
              </div>
            </div>
          </div>

          {/* 제품 정보 모달 */}
          {showProductModal && (
            <ProductListModal
              products={feed.products}
              onClose={toggleProductModal}
            />
          )}
        </div>
      ) : (
        <p>Feed not found</p>
      )}
    </div>
  );
};

export default FeedDetailPage;