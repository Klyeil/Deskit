import React from 'react';
import ReactDOM from 'react-dom/client';  // 'react-dom'에서 'react-dom/client'로 변경
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter 추가
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // createRoot 사용
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
