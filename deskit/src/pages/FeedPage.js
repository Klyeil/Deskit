import React, { useState, useEffect } from 'react';
import '../styles/FeedPage.css';
import { FaHome, FaCompass, FaBell, FaBookmark, FaCog, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// 로그인된 사용자 정보
const FeedPage = () => {
  // 로그인 여부를 state로 관리
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동

  // 사용자 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem('token'); // 로컬스토리지에서 JWT 토큰 가져오기
    if (!token) {
      setLoading(false); // 토큰이 없으면 로딩 종료
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // 로그인된 사용자 정보 상태에 저장
        } else {
          setUser(null); // 로그인 실패 시 null 설정
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null); // 오류 발생 시 null 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchUserProfile();
  }, []);

    // 로그인 페이지로 이동
    const goToLoginPage = () => {
        navigate('/login'); // /login 경로로 이동
    };

  return (
    <div className="feed-page-container">
      {/* 사이드바 */}
      <aside className="sidebar-container">
        <div className="sidebar">
          <div className="user-profile">
            {loading ? (
              <p>Loading...</p> // 로딩 중 표시
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
                <p className="user-name" onClick={goToLoginPage} style={{ cursor: 'pointer', color: '#7655E3', marginLeft : '65px'}}>로그인이 필요합니다</p>
              </div>
            )}
          </div>
          <nav className="sidebar-nav">
            <a href="/" className="nav-item active"> 홈</a>
            <a href="#" className="nav-item"> 탐색</a>
            <a href="/upload" className="nav-item active"> 업로드</a>
            <a href="#" className="nav-item"> 알림</a>
            <a href="#" className="nav-item"> 저장된 게시물</a>
            <a href="#" className="nav-item"> 설정</a>
          </nav>
        </div>
        <div className="upload-feed">
          <button className="upload-btn"><FaPlus /> Upload Feed</button>
        </div>
      </aside>

      {/* 메인 피드 영역 */}
      <main className="feed-content">
        <div className="feed-header">
        </div>
        <div className="feed-items">
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
