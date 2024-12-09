import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FeedUpload() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !title || !description) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:3001/feeds/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        // 업로드 성공 후 프로필 페이지로 리다이렉트
        navigate('/profile');
      }
    } catch (error) {
      console.error('피드 업로드 실패', error.response || error.message);
      alert('피드 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feed-upload-container">
      <h2>피드 업로드</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이미지 업로드:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <div>
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>설명:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '업로드 중...' : '업로드'}
        </button>
      </form>
    </div>
  );
}

export default FeedUpload;
