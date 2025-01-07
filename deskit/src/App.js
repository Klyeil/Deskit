import React from 'react';
import './App.css'; // 스타일 추가
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';  // Footer 컴포넌트 추가
import PasswordCheckPage from './pages/PasswordCheckPage';
import ProfileSettingsPage from './pages/ProfileSettingPage';
import SiteSettingsPage from './pages/SiteSettingsPage';
import FeedUpload from './pages/FeedUpload';
import FeedPage from './pages/FeedPage';
import FeedDetailPage from './pages/FeedDetailPage';
import SellerPage from './pages/SellerPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashBoard';
import CompanyManagement from './pages/CompanyManagement';
import CategoryManagement from './pages/CategoryManagement';
import ProductManagement from './pages/ProductManagement';
import CompanyProducts from './pages/CompanyProducts';
import ProductListPage from './pages/ProductListPage';
import SellerDashboard from './pages/SellerDashBoard';
import ProductDetailPage from './pages/ProductDetailPage';


function App() {
  return (
    <UserProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile/verify-password" element={<PasswordCheckPage />} />
          <Route path="/profile/settings" element={<ProfileSettingsPage />} />
          <Route path="/settings" element={<SiteSettingsPage />} />
          <Route path="/upload" element={<FeedUpload />} />
          <Route path="/" element={<FeedPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} /> {/* 상세 페이지 경로 */}
          <Route path="/feed-detail/:feedId" element={<FeedDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/admin/companies" element={<CompanyManagement/>} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/products/:companyId" element={<CompanyProducts />} />


          {/* 관리자 전용 페이지 라우트 
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 판매자 전용 페이지 라우트 */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </UserProvider>
  );
}


export default App;
