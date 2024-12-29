import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 게시물 ID를 URL에서 가져오기
import '../styles/PostDetailPage.css';

const PostDetailPage = () => {
  const { postId } = useParams(); // 게시물 ID 가져오기
  const [post, setPost] = useState(null); // 게시물 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState(''); // 새 댓글 입력 값
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await fetch(`http://localhost:3001/posts/${postId}`);
        const commentResponse = await fetch(`http://localhost:3001/posts/${postId}/comments`);
  
        if (postResponse.ok && commentResponse.ok) {
          const postData = await postResponse.json();
          const commentData = await commentResponse.json();
          setPost(postData);
          setComments(commentData);
        } else {
          console.error('Failed to fetch post or comments');
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPostData();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
  
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: user ? user.nickname : 'Anonymous',
          content: newComment,
        }),
      });
  
      if (response.ok) {
        const addedComment = await response.json();
        setComments((prev) => [addedComment, ...prev]);
        setNewComment('');
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="post-detail-page">
      {loading ? (
        <p>Loading...</p>
      ) : post ? (
        <div className="post-container">
          {/* 상단 영역 */}
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span className="post-author">@{post.author}</span>
              <span className="post-date">{post.date}</span>
            </div>
          </div>

          {/* 중앙 영역 */}
          <div className="post-content">
            <p>{post.content}</p>
            <div className="post-stats">
              <span>❤️ {post.likes} Likes</span>
              <span>💬 {comments.length} Comments</span>
            </div>
          </div>

          {/* 하단 댓글 영역 */}
          <div className="comments-section">
            <h3>댓글</h3>
            <div className="comment-input">
              <textarea
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit}>작성</button>
            </div>
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <div className="comment-author">@{comment.author}</div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-date">{comment.date}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>게시물을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default PostDetailPage;