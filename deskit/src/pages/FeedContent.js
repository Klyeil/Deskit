import React, { useEffect, useState } from 'react';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { AiFillHeart, AiOutlineHeart, AiOutlineInfoCircle } from 'react-icons/ai';
import { useUser } from '../context/UserContext';
import ProductListModal from './ProductListModal'; // 모달 컴포넌트
import '../styles/FeedContent.css'; // CSS 파일 경로에 맞게 설정

const FeedContent = () => {
  const [feeds, setFeeds] = useState([]);
  const [liked, setLiked] = useState([false]);
  const [saved, setSaved] = useState([false]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch('http://localhost:3001/feeds/random');
        if (response.ok) {
          const data = await response.json();
          setFeeds(data); // 피드를 상태로 저장
        } else {
          console.error('Failed to fetch feeds:', response.status);
        }
      } catch (error) {
        console.error('Error fetching feeds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  const toggleProductModal = (feedId) => {
    console.log(`Product info modal triggered for feed ID: ${feedId}`);
    setShowProductModal((prev) => !prev);
    // 여기에 모달 열기 로직 추가
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
  };



  return (
    <div className="feed-contents">
      {feeds.length === 0 ? (
        <p>피드가 없습니다. 새로운 게시물을 업로드하세요.</p>
      ) : (
        feeds.map((feed) => (
          <div key={feed._id} className="feed-itemm">
            <div className="feed-layouts">
              <div className="feed-detail-containers">
                <div className="feed-headers">
                  <div className="user-infos">
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
          </div>
        ))
      )}
    </div>
  );
};

export default FeedContent;

