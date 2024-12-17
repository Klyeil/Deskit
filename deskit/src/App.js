import React from 'react';
import './App.css'; // 스타일 추가
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
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



function App() {
  return (
    <UserProvider>
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/verify-password" element={<PasswordCheckPage />} />
        <Route path="/profile/settings" element={<ProfileSettingsPage />} />
        <Route path="/settings" element={<SiteSettingsPage />} />
        <Route path="/upload" element={<FeedUpload />} />
        <Route path="/feeds" element={<FeedPage />} />
        <Route path="/feed-detail/:feedId" element={<FeedDetailPage />} />
      </Routes>
      <Footer />  {/* Footer 추가 */}
    </div>
    </UserProvider>
  );
}

export default App;
