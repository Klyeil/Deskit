// src/pages/HomePage.js
import React from 'react';
import '../styles/HomePage.css';
import Banner from '../components/Banner';

function HomePage() {
  const images = [
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300'
    // 다른 이미지 URL 추가
  ];

  return (
    <div className="homepage">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image} alt={`Image ${index + 1}`} />
        </div>
      ))}
    </div>
  );
}

export default HomePage;
