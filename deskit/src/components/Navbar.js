// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegUser, FaRegBookmark } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import '../styles/Navbar.css';

function Navbar() {
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
        <Link to="/login" className="nav-link">
            <FaRegUser size={22} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
