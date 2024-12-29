import React, { useState, useEffect } from 'react';
import '../styles/FeedPage.css';
import { useNavigate } from 'react-router-dom';
import FeedContent from './FeedContent'; // 메인 피드 컴포넌트
import CommunityContent from './CommunityContent'; // 커뮤니티 컴포넌트

const FeedPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('feed'); // 'feed' 또는 'community'

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/profile', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 업로드 버튼 클릭 시 업로드 페이지로 이동
  const goToUploadPage = () => {
    navigate('/upload');
  };

  return (
    <div className="feed-page-container">
      {/* 사이드바 */}
      <aside className="sidebar-container">
        <div className="sidebar">
          <div className="user-profile">
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <>
                <img src={`http://localhost:3001${user.profileImage}`} alt="Profile" className="profile-image" />
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-username">@ {user.nickname}</p>
                </div>
              </>
            ) : (
              <div className="user-info">
                <p
                  className="user-name"
                  onClick={() => navigate('/login')}
                  style={{ cursor: 'pointer', color: '#7655E3', marginLeft: '65px' }}
                >
                  로그인이 필요합니다
                </p>
              </div>
            )}
          </div>
          <nav className="sidebar-nav">
            <button onClick={() => setActivePage('feed')} className={`nav-item ${activePage === 'feed' ? 'active' : ''}`}>
              피드
            </button>
            <button
              onClick={() => setActivePage('community')}
              className={`nav-item ${activePage === 'community' ? 'active' : ''}`}
            >
              커뮤니티
            </button>
          </nav>
        </div>
        <div className="upload-feed">
          <button className="uploads-btn" onClick={goToUploadPage}>
            업로드
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="feed-content">
        {activePage === 'feed' ? <FeedContent /> : <CommunityContent />}
      </main>
    </div>
  );
};

export default FeedPage;