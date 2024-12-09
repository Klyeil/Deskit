import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SiteSettingsPage.css';

function SiteSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    language: 'ko',  // 기본 언어는 한국어
    privacy: 'public',  // 기본 공개 설정은 'public'
  });

  // 설정 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 설정 저장
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/settings', settings, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        alert('설정이 저장되었습니다.');
      } else {
        alert('설정 저장에 실패했습니다.');
      }
    } catch (error) {
      console.log('Error saving settings:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="site-settings">
      <h2>사이트 설정</h2>
      
      <form>
        <div className="setting-item">
          <label>이메일 알림</label>
          <input 
            type="checkbox"
            name="emailNotifications"
            checked={settings.emailNotifications}
            onChange={handleChange}
          />
        </div>

        <div className="setting-item">
          <label>푸시 알림</label>
          <input 
            type="checkbox"
            name="pushNotifications"
            checked={settings.pushNotifications}
            onChange={handleChange}
          />
        </div>

        <div className="setting-item">
          <label>언어 설정</label>
          <select 
            name="language" 
            value={settings.language}
            onChange={handleChange}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="setting-item">
          <label>개인정보 보호 설정</label>
          <select 
            name="privacy" 
            value={settings.privacy}
            onChange={handleChange}
          >
            <option value="public">공개</option>
            <option value="private">비공개</option>
          </select>
        </div>

        <button type="button" onClick={handleSave}>저장</button>
      </form>
    </div>
  );
}

export default SiteSettingsPage;
