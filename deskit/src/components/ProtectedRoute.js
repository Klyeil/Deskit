import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉트
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // 권한이 없는 경우 접근 금지 메시지 표시
    return <div>접근 권한이 없습니다.</div>;
  }

  // 권한이 있는 경우에만 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
