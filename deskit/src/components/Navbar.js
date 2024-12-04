import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser, FaRegBookmark } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 로그인 상태 확인 (JWT 토큰 존재 여부로 판단)
  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleUserClick = () => {
    if (isLoggedIn) {
      // 로그인 상태라면 프로필 페이지로 이동
      navigate('/profile');
    } else {
      // 로그인하지 않았다면 로그인 페이지로 이동
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Deskit</Link>
      <div className="nav-links">
        <Link to="/upload" className="nav-link">
            <FiUpload size={23} />
        </Link>
        <Link to="/bookmark" className="nav-link">
            <FaRegBookmark size={23} />
        </Link>
        <div className="nav-link" onClick={handleUserClick}>
            <FaRegUser size={22} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
