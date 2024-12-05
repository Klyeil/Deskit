import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';
import { MdLogout } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    birthday: '',
    address: '',
  });
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
        setFormData({
          name: response.data.name,
          nickname: response.data.nickname,
          email: response.data.email,
          birthday: response.data.birthday,
          address: response.data.address,
        });
        setProfileImagePreview(response.data.profileImage || '');
      } catch (err) {
        setError('사용자 정보를 가져오는 데 실패했습니다.');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
      navigate('/login');
    }
  }, [error, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setProfileImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setProfileImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const updatedData = new FormData();
    Object.keys(formData).forEach((key) => {
      updatedData.append(key, formData[key]);
    });

    if (profileImageFile) {
      updatedData.append('profileImage', profileImageFile);
    }

    try {
      const response = await axios.put('http://localhost:3001/profile/update', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data.user);
      setProfileImagePreview(response.data.user.profileImage);
      setIsEditing(false);
      alert('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 수정 오류:', error);
      alert('프로필 수정에 실패했습니다.');
    }
  };

  return (
    <div className="profile-page">
      <div className="sidebar">
        <div className="sidebar-icon" onClick={() => navigate('/profile')}>
          <FaRegUser size={24} />
        </div>
        <div className="sidebar-icon" onClick={() => navigate('/settings')}>
          <IoSettingsOutline size={27} />
        </div>
        <div className="sidebar-icon" onClick={handleLogout}>
          <MdLogout size={26} />
        </div>
      </div>

      <div className="profile-content">
        {user ? (
          <div>
            <h2>{user.name}님의 프로필</h2>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>이름</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>닉네임</label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>생일</label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>주소</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>프로필 사진</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {profileImagePreview && (
                    <img
                      src={profileImagePreview}
                      alt="Profile Preview"
                      className="profile-image-preview"
                    />
                  )}
                </div>
                <button type="submit" className="save-button">저장</button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
              </form>
            ) : (
              <div className="profile-info">
                <p><strong>이름:</strong> {user.name}</p>
                <p><strong>닉네임:</strong> {user.nickname}</p>
                <p><strong>이메일:</strong> {user.email}</p>
                <p><strong>생일:</strong> {user.birthday}</p>
                <p><strong>주소:</strong> {user.address}</p>
                {profileImagePreview && (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="profile-image"
                  />
                )}
                <button onClick={() => setIsEditing(true)}>수정</button>
              </div>
            )}
          </div>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
