import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export default function Search() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({ users: [], courses: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || query.length < 3 || !token) return;
    
    setIsSearching(true);
    try {
      const data = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await data.json();
      setResults(json);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching:', error);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const totalResults = (results.users?.length || 0) + (results.courses?.length || 0) + (results.posts?.length || 0);

  return (
    <div className="rv d3 mt-8 px-8">
      <style>{`
        .search-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .search-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .search-title {
          font-family: 'Manrope', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1730;
          margin-bottom: 0.5rem;
        }
        .search-subtitle {
          font-family: 'Manrope', sans-serif;
          font-size: 1rem;
          color: #6b7280;
        }
        .search-input-wrapper {
          position: relative;
          margin-bottom: 2rem;
        }
        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e8e8e8;
          border-radius: 16px;
          font-family: 'Manrope', sans-serif;
          font-size: 1rem;
          color: #1a1730;
          background: #ffffff;
          transition: all 0.2s ease;
          outline: none;
        }
        .search-input:focus {
          border-color: #5D45FD;
          box-shadow: 0 0 0 4px rgba(93, 69, 253, 0.1);
        }
        .search-input::placeholder {
          color: #9ca3af;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }
        .search-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #5D45FD 0%, #7B68EE 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Manrope', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 1rem;
        }
        .search-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(93, 69, 253, 0.3);
        }
        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .search-stats {
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }
        .search-section {
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.2s ease;
        }
        .search-section:hover {
          border-color: #5D45FD;
          box-shadow: 0 4px 20px rgba(93, 69, 253, 0.1);
        }
        .search-section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .search-section-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #5D45FD 0%, #7B68EE 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .search-section-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1730;
        }
        .search-section-count {
          font-family: 'DM Mono', monospace;
          font-size: 0.875rem;
          color: #6b7280;
          margin-left: auto;
        }
        .search-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .search-item:hover {
          background: #f8f9ff;
        }
        .search-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #5D45FD;
        }
        .search-avatar-placeholder {
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
        .search-content {
          flex: 1;
        }
        .search-name {
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          color: #5D45FD;
          margin-bottom: 0.25rem;
        }
        .search-description {
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.4;
        }
        .search-empty {
          text-align: center;
          padding: 3rem 1rem;
        }
        .search-empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }
        .search-empty-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1730;
          margin-bottom: 0.5rem;
        }
        .search-empty-description {
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: #6b7280;
        }
        @media (max-width: 768px) {
          .search-container {
            padding: 0 1rem;
          }
          .search-title {
            font-size: 1.5rem;
          }
          .search-section {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="search-container">
        {/* Header */}
        <div className="search-header">
          <h1 className="search-title">Поиск</h1>
          <p className="search-subtitle">Найдите пользователей, курсы и посты</p>
        </div>

        {/* Search Input */}
        <div className="search-input-wrapper">
          <div className="search-icon">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите минимум 3 символа для поиска..."
            className="search-input"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!query.trim() || query.length < 3 || isSearching}
          className="search-button"
        >
          {isSearching ? 'Поиск...' : 'Найти'}
        </button>

        {/* Results */}
        {hasSearched && (
          <>
            {/* Search Stats */}
            <div className="search-stats">
              {totalResults > 0 
                ? `Найдено результатов: ${totalResults}`
                : 'Ничего не найдено'
              }
            </div>

            {/* Users Section */}
            {results.users?.length > 0 && (
              <div className="search-section">
                <div className="search-section-header">
                  <div className="search-section-icon">
                    <UserIcon />
                  </div>
                  <h3 className="search-section-title">Пользователи</h3>
                  <span className="search-section-count">{results.users.length}</span>
                </div>
                <div className="space-y-2">
                  {results.users.map((user: any) => (
                    <div 
                      key={user.id} 
                      className="search-item"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      {user.profile?.avatar_url ? (
                        <img
                          src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `/uploads${user.profile.avatar_url}`}
                          alt="Avatar"
                          className="search-avatar"
                        />
                      ) : (
                        <div className="search-avatar-placeholder">
                          {(user.profile?.username || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="search-content">
                        <div className="search-name">
                          {user.profile?.username || user.email}
                        </div>
                        <div className="search-description">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses Section */}
            {results.courses?.length > 0 && (
              <div className="search-section">
                <div className="search-section-header">
                  <div className="search-section-icon">
                    <BookIcon />
                  </div>
                  <h3 className="search-section-title">Курсы</h3>
                  <span className="search-section-count">{results.courses.length}</span>
                </div>
                <div className="space-y-2">
                  {results.courses.map((course: any) => (
                    <div key={course.id} className="search-item">
                      <div className="search-avatar-placeholder">
                        📚
                      </div>
                      <div className="search-content">
                        <div className="search-name">{course.title}</div>
                        <div className="search-description">
                          {course.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {results.posts?.length > 0 && (
              <div className="search-section">
                <div className="search-section-header">
                  <div className="search-section-icon">
                    <MessageIcon />
                  </div>
                  <h3 className="search-section-title">Посты</h3>
                  <span className="search-section-count">{results.posts.length}</span>
                </div>
                <div className="space-y-2">
                  {results.posts.map((post: any) => (
                    <div key={post.id} className="search-item">
                      <div className="search-avatar-placeholder">
                        💬
                      </div>
                      <div className="search-content">
                        <div className="search-name">
                          {post.author?.profile?.username || post.author?.email}
                        </div>
                        <div className="search-description">
                          {post.content.length > 100 
                            ? post.content.substring(0, 100) + '...' 
                            : post.content
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {totalResults === 0 && (
              <div className="search-section">
                <div className="search-empty">
                  <div className="search-empty-icon">
                    <SearchIcon />
                  </div>
                  <h3 className="search-empty-title">Ничего не найдено</h3>
                  <p className="search-empty-description">
                    Попробуйте изменить поисковый запрос или проверьте опечатки
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
