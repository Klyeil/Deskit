import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PasswordCheckPage.css';

function PasswordCheckPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/verify-password', { password }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // JWT 토큰을 Authorization 헤더에 추가
        }
      });

      // 비밀번호가 맞으면 회원 정보 설정 페이지로 이동
      if (response.data.success) {
        navigate('/profile/settings');  // 비밀번호가 맞으면 이동
      } else {
        setError(response.data.message);  // 서버에서 전달한 메시지 사용
      }
    } catch (err) {
      setError('비밀번호가 옳지 않습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="password-check-page">
      <div className="password-check-container">
        <h2>비밀번호 확인</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
          <button type="submit">확인</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default PasswordCheckPage;
