import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostUploadPage.css';

const PostUploadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'General', // 기본 카테고리
    content: '',
  });

  const categories = ['General', 'Q&A', 'Notice']; // 카테고리 목록

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/posts/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('게시글이 업로드되었습니다!');
        navigate('/community'); // 업로드 후 커뮤니티 메인 페이지로 이동
      } else {
        const errorData = await response.json();
        alert(`업로드 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('서버 오류로 업로드 실패');
    }
  };

  return (
    <div className="post-upload-page">
      <h2>게시글 작성</h2>
      <form className="post-upload-form" onSubmit={handleSubmit}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          required
        />

        <label htmlFor="category">카테고리</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label htmlFor="content">본문</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="내용을 입력하세요"
          rows="10"
          required
        />

        <button type="submit" className="upload-button">
          업로드
        </button>
      </form>
    </div>
  );
};

export default PostUploadPage;