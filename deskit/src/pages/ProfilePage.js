import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err);
        if (err.response && err.response.status === 401) {
          alert('세션이 만료되었습니다. 다시 로그인하세요.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('사용자 정보를 가져오는 데 실패했습니다.');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchUserFeeds = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/feeds', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeeds(response.data);
      } catch (err) {
        console.error('피드 가져오기 실패:', err);
        if (err.response && err.response.status === 401) {
          alert('세션이 만료되었습니다. 다시 로그인하세요.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setFeeds([]);
          setError('피드를 가져오는 데 실패했습니다.');
        }
      }
    };

    fetchUserFeeds();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToFeedDetail = (feedId) => {
    navigate(`/feed-detail/${feedId}`);
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        {error && <p className="error-message">{error}</p>}

        {user ? (
          <div>
            <div className="profile-header">
              {user.profileImage ? (
                <img
                  src={`http://localhost:3001${user.profileImage}`}
                  alt="Profile"
                  className="profile-header-image"
                />
              ) : (
                <div className="profile-placeholder">No Image</div>
              )}
              <h2 className="profile-header-nickname">{user.nickname}</h2>
              <button
                className="settings-btn"
                onClick={() => navigate('/profile/verify-password')}
              >
                회원 정보 설정
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </div>

            <div className="feeds">
              {feeds.length > 0 ? (
                feeds.map((feed) => (
                  <div
                    key={feed._id}
                    className="feed-item"
                    onClick={() => goToFeedDetail(feed._id)}
                  >
                    <img
                      src={feed.image}
                      alt={feed.title}
                      className="feed-image"
                    />
                  </div>
                ))
              ) : (
                <p>표시할 피드가 없습니다.</p>
              )}
            </div>
          </div>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
