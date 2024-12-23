import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Postcode from 'react-daum-postcode';
import { AiOutlineClose } from 'react-icons/ai';
import '../styles/SignUpPage.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPostcode, setShowPostcode] = useState(false); // 팝업 상태

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    const userData = {
      email,
      password,
      name,
      nickname,
      birthday,
      address: `${address} ${addressDetail}`,
      role: 'user'
    };

    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setSuccessMessage('회원가입이 완료되었습니다!');
        setErrorMessage('');
        navigate('/profile');
      } else {
        setErrorMessage(data.message || '회원가입에 실패했습니다.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('서버와 연결할 수 없습니다.');
      setSuccessMessage('');
    }
  };

  const handleAddressSearch = (data) => {
    setAddress(data.address);
    setShowPostcode(false); // 팝업 닫기
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthday">생일</label>
          <input
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">주소</label>
          <input
            type="text"
            id="address"
            value={address}
            readOnly
            onClick={() => setShowPostcode(true)} // 클릭 시 팝업 열기
            placeholder="주소를 검색하려면 클릭하세요"
          />
        </div>

        {showPostcode && (
          <div className="postcode-overlay">
            <div className="postcode-popup">
              <AiOutlineClose
                className="close-icon"
                onClick={() => setShowPostcode(false)}
              />
              <Postcode onComplete={handleAddressSearch} />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="addressDetail">상세 주소</label>
          <input
            type="text"
            id="addressDetail"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            placeholder="상세 주소를 입력하세요"
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="signup-btn">회원가입</button>
      </form>
      <div className="signup-link">
        <p>이미 계정이 있나요? <Link to="/login" className="signup-link-text">로그인</Link></p>
      </div>
    </div>
  );
}

export default SignUpPage;
