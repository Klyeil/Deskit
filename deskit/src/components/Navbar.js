import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { MdDynamicFeed } from "react-icons/md";
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
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
      navigate('/search?query=${searchQuery}');
    }
  };

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
          <MdDynamicFeed size={25} />
        </Link>
        <Link to="/cart" className="nav-link">
          <FiShoppingCart size={23} />
        </Link>
        <div
          className="nav-link user-icon"
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <FaRegUser size={22} onClick={handleProfileClick} /> {/* 아이콘 클릭 시 프로필로 이동 */}
          <div
            className={`dropdown-menu ${showUserMenu ? 'visible' : ''}`}
            onMouseEnter={() => setShowUserMenu(true)}  // 메뉴로 마우스 올리면 메뉴 보이게 설정
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
