import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfileSettingPage.css';

function ProfileSettingsPage() {
  const [userData, setUserData] = useState({
    name: '',
    nickname: '',
    birthday: '',
    address: '',
    profileImage: ''
  });

  useEffect(() => {
    // 사용자 정보 불러오기
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.log('Error loading profile', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 사용자 정보 업데이트 로직 추가
  };

  return (
    <div>
      <h2>회원 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름:</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </div>
        <div>
          <label>닉네임:</label>
          <input
            type="text"
            value={userData.nickname}
            onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
          />
        </div>
        <div>
          <label>생일:</label>
          <input
            type="date"
            value={userData.birthday}
            onChange={(e) => setUserData({ ...userData, birthday: e.target.value })}
          />
        </div>
        <div>
          <label>주소:</label>
          <input
            type="text"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
          />
        </div>
        <div>
          <label>프로필 이미지:</label>
          <input type="file" />
        </div>
        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default ProfileSettingsPage;
