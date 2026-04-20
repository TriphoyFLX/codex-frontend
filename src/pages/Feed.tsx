import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const API = "";

// Icons
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function Feed() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (token) {
      loadPosts();
    }
  }, [token]);

  const loadPosts = async () => {
    if (!token) return;
    try {
      const data = await api.posts.getAll(token);
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile || !token) return null;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const response = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !token) return;
    
    setUploading(true);
    try {
      let imageUrl: string | null = null;
      if (selectedFile) {
        imageUrl = await uploadImage();
      }
      
      await api.posts.create(token, newPost, imageUrl || undefined);
      setNewPost('');
      setSelectedFile(null);
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!token) return;
    try {
      await api.posts.like(token, postId);
      loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content?.trim() || !token) return;

    try {
      await fetch(`${API}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      loadPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="rv d3 mt-8 px-8">
      <style>{`
        .feed-card {
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
        }
        .feed-card:hover {
          border-color: #5D45FD;
          box-shadow: 0 4px 20px rgba(93, 69, 253, 0.1);
        }
        .feed-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #5D45FD;
        }
        .feed-avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5D45FD 0%, #7B68EE 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }
        .feed-username {
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #5D45FD;
          cursor: pointer;
          transition: color 0.2s;
        }
        .feed-username:hover {
          color: #4a35d9;
        }
        .feed-date {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #888;
        }
        .feed-content {
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          color: #333;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .feed-image {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .feed-actions {
          display: flex;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid #e8e8e8;
        }
        .feed-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          color: #666;
        }
        .feed-action-btn:hover {
          border-color: #5D45FD;
          color: #5D45FD;
        }
        .feed-action-btn.liked {
          background: #5D45FD;
          border-color: #5D45FD;
          color: white;
        }
        .feed-comments {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e8e8e8;
        }
        .feed-comment {
          background: #f8f8f8;
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 10px;
        }
        .feed-comment-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        .feed-comment-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          transition: border-color 0.2s;
        }
        .feed-comment-input:focus {
          outline: none;
          border-color: #5D45FD;
        }
        .btn-acid {
          background: #5D45FD;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-acid:hover {
          background: #4a35d9;
        }
        .btn-ghost {
          background: white;
          color: #666;
          padding: 8px 16px;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover {
          border-color: #5D45FD;
          color: #5D45FD;
        }
        .feed-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          resize: vertical;
          min-height: 60px;
          transition: border-color 0.2s;
        }
        .feed-textarea:focus {
          outline: none;
          border-color: #5D45FD;
        }
        .feed-file-input {
          margin-top: 10px;
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <h2 className="disp" style={{ fontSize: 32, color: 'var(--text)' }}>Лента</h2>
        <button
          onClick={() => setNewPost('')}
          className="btn-acid"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusIcon /> Создать пост
          </span>
        </button>
      </div>

      {newPost && (
        <div className="feed-card">
          <textarea
            id="post-content"
            name="content"
            placeholder="Что у вас нового?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="feed-textarea"
            rows={3}
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreatePost}
              className="btn-acid"
              disabled={uploading}
            >
              {uploading ? 'Публикация...' : 'Опубликовать'}
            </button>
            <button
              onClick={() => setNewPost('')}
              className="btn-ghost"
            >
              Отмена
            </button>
          </div>
          <input
            id="post-image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="feed-file-input"
          />
          {selectedFile && (
            <p style={{ fontSize: 13, color: '#888', marginTop: 8 }}>Выбран: {selectedFile.name}</p>
          )}
        </div>
      )}

      <div>
        {posts.map((post) => (
          <div key={post.id} className="feed-card">
            <div className="flex items-center gap-4 mb-4">
              {post.author?.profile?.avatar_url ? (
                <img
                  src={post.author.profile.avatar_url.startsWith('http') ? post.author.profile.avatar_url : `${API}${post.author.profile.avatar_url}`}
                  alt="Avatar"
                  className="feed-avatar"
                />
              ) : (
                <div className="feed-avatar-placeholder">
                  {(post.author?.profile?.username || post.author?.email || '?')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p 
                  className="feed-username"
                  onClick={() => post.author?.id && navigate(`/profile/${post.author.id}`)}
                >
                  {post.author?.profile?.username || post.author?.email}
                </p>
                <p className="feed-date">{new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <p className="feed-content">{post.content}</p>
            {post.image_url && (
              <img
                src={`${API}${post.image_url}`}
                alt="Post image"
                className="feed-image"
              />
            )}
            <div className="feed-actions">
              <button
                onClick={() => handleLike(post.id)}
                className="feed-action-btn"
              >
                <HeartIcon /> {post._count?.likes || 0}
              </button>
              <button
                onClick={() => toggleComments(post.id)}
                className="feed-action-btn"
              >
                <CommentIcon /> {post._count?.comments || 0}
              </button>
            </div>

            {expandedComments.has(post.id) && (
              <div className="feed-comments">
                <div className="mb-4">
                  {post.comments?.map((comment: any) => (
                    <div key={comment.id} className="feed-comment">
                      <div className="flex items-center gap-3 mb-2">
                        {comment.author?.profile?.avatar_url ? (
                          <img
                            src={comment.author.profile.avatar_url.startsWith('http') ? comment.author.profile.avatar_url : `${API}${comment.author.profile.avatar_url}`}
                            alt="Avatar"
                            className="feed-comment-avatar"
                          />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#5D45FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 600 }}>
                            {(comment.author?.profile?.username || comment.author?.email || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: '#333' }}>
                            {comment.author?.profile?.username || comment.author?.email}
                          </p>
                          <span className="feed-date">
                            {new Date(comment.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontFamily: 'Manrope', fontSize: 14, color: '#666', lineHeight: 1.5 }}>{comment.content}</p>
                    </div>
                  ))}
                  {(!post.comments || post.comments.length === 0) && (
                    <p style={{ fontFamily: 'Manrope', fontSize: 14, color: '#888', textAlign: 'center', padding: '20px 0' }}>Пока нет комментариев</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Написать комментарий..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    className="feed-comment-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="btn-acid"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
