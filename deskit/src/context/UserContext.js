// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // localStorage에서 JWT 토큰을 가져옵니다 (만약 로그인 시에 저장했다면)
        const token = localStorage.getItem('token');  // 예시로 localStorage 사용

        if (!token) {
          console.error('No token found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3001/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // JWT 토큰을 Authorization 헤더에 추가
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);  // 사용자 데이터 출력
          setUser(data);  // 사용자 데이터 업데이트
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);  // []로 빈 배열을 넣으면 컴포넌트가 마운트될 때만 실행됨

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
