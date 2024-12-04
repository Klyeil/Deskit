import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // useNavigate로 리다이렉트 처리

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Token', token);

      if (!token) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        setError('로그인이 필요합니다.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/profile', {
            headers: {
              Authorization: `Bearer ${token}`,  // token이 제대로 저장되어 있는지 확인
            },
          });
          
        console.log(response.config.headers);

        setUser(response.data); // 사용자 정보 저장
      } catch (err) {
        setError('사용자 정보를 가져오는 데 실패했습니다.');
      }
    };

    fetchUserProfile();
  }, []);

  // error 상태가 있을 때 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (error) {
      navigate('/login');
    }
  }, [error, navigate]);

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-info">
          <h2>{user.name}님의 프로필</h2>
          <p>이메일: {user.email}</p>
          <p>생일: {user.birthday}</p>
          <p>주소: {user.address}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
}

export default ProfilePage;
