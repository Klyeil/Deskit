import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // useNavigate 훅 추가
import '../styles/ProfileSettingPage.css';

function ProfileSettingsPage() {
  const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 훅 사용

  const [userData, setUserData] = useState({
    name: '',
    nickname: '',
    birthday: '',
    address: '',
    profileImage: '',
  });

  useEffect(() => {
    // 사용자 정보 불러오기
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.log('Error loading profile', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', userData.name);
    formData.append('nickname', userData.nickname);
    formData.append('birthday', userData.birthday);
    formData.append('address', userData.address);

    // 프로필 이미지가 변경되었을 경우 파일 추가
    if (userData.profileImage instanceof File) {
      formData.append('profileImage', userData.profileImage);
    }

    try {
      const response = await axios.put('http://localhost:3001/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile updated:', response.data);
      alert('회원 정보가 성공적으로 수정되었습니다!');

      // 프로필 페이지로 이동
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('회원 정보 수정에 실패했습니다.');
    }
  };

  return (
    <div className="profile-settings-container">
      <h2>회원 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>이름:</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>닉네임:</label>
          <input
            type="text"
            value={userData.nickname}
            onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>생일:</label>
          <input
            type="date"
            value={userData.birthday}
            onChange={(e) => setUserData({ ...userData, birthday: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>주소:</label>
          <input
            type="text"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>프로필 이미지:</label>
          <input
            type="file"
            onChange={(e) => setUserData({ ...userData, profileImage: e.target.files[0] })}
          />
        </div>
        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default ProfileSettingsPage;
