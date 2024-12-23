import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser, FaWifi, FaCogs } from 'react-icons/fa'; // Admin 아이콘 추가
import { FiShoppingCart } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode'; // jwt-decode에서 named import로 수정
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isLoggedIn = localStorage.getItem('token') !== null;

  // 사용자 역할 (예: 로컬 스토리지에서 'role' 가져오기)
  const userRole = localStorage.getItem('role'); // 'admin' 또는 'user' 저장됨

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // 역할 정보도 제거
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile'); // 아이콘 클릭 시 프로필 페이지로 이동
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  // 로그인된 사용자라면 토큰에서 사용자 정보 추출
  let decodedToken = null;
  if (isLoggedIn) {
    const token = localStorage.getItem('token');
    try {
      decodedToken = jwtDecode(token); // jwtDecode로 디코딩
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  // 토큰이 정상적으로 디코딩되어 있으면 사용자 역할을 체크하여 admin 페이지 링크를 표시
  const isAdmin = decodedToken && decodedToken.role === 'admin';

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Deskit</Link>
      {/* 검색창 추가 */}
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </form>
      <div className="nav-links">
        <Link to="/feeds" className="nav-link">
          <FaWifi size={25} />
        </Link>
        <Link to="/cart" className="nav-link">
          <FiShoppingCart size={23} />
        </Link>
        {/* Admin 역할 사용자만 Admin 페이지 아이콘 표시 */}
        {isAdmin && (
          <Link to="/admin" className="nav-link">
            <FaCogs size={23} title="Admin Dashboard" />
          </Link>
        )}
        <div
          className="nav-link user-icon"
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <FaRegUser size={22} onClick={handleProfileClick} /> {/* 아이콘 클릭 시 프로필로 이동 */}
          <div
            className={`dropdown-menu ${showUserMenu ? 'visible' : ''}`}
            onMouseEnter={() => setShowUserMenu(true)} // 메뉴로 마우스 올리면 메뉴 보이게 설정
            onMouseLeave={() => setShowUserMenu(false)} // 메뉴 밖으로 나가면 메뉴 숨기기
          >
            {isLoggedIn ? (
              <>
                <div className="dropdown-item" onClick={() => navigate('/settings')}>설정</div>
                <div className="dropdown-item" onClick={handleLogout}>로그아웃</div>
              </>
            ) : (
              <>
                <div className="dropdown-item" onClick={() => navigate('/login')}>로그인</div>
                <div className="dropdown-item" onClick={() => navigate('/signup')}>회원가입</div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
