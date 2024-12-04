import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 로그인 요청 보내기
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });

      // 서버에서 인증 성공하면 메시지를 처리
      if (response.status === 200) {
        alert('로그인 성공!');
        window.location.href = '/'; // 홈 페이지로 이동
      }
    } catch (err) {
      // 로그인 실패 시 에러 처리
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>
      <div className="signup-link">
        <p>
          계정이 없으신가요?{' '}
          <a href="/signup" className="signup-link-text">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
