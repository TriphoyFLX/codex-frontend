import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({ users: [], courses: [], posts: [] });

  const handleSearch = async () => {
    if (!query.trim() || query.length < 3 || !token) return;
    try {
      const data = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await data.json();
      setResults(json);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Поиск</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Поиск пользователей, курсов, постов..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Искать
        </button>
      </div>

      <div className="space-y-6">
        {results.users?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Пользователи</h3>
            <div className="space-y-2">
              {results.users.map((user: any) => (
                <div 
                  key={user.id} 
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  {user.profile?.avatar_url && (
                    <img
                      src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${user.profile.avatar_url}`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  {!user.profile?.avatar_url && (
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  )}
                  <div>
                    <p className="font-medium text-blue-500 hover:text-blue-600">{user.profile?.username || user.email}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.courses?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Курсы</h3>
            <div className="space-y-2">
              {results.courses.map((course: any) => (
                <div key={course.id} className="p-2 hover:bg-gray-50 rounded">
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.posts?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Посты</h3>
            <div className="space-y-2">
              {results.posts.map((post: any) => (
                <div key={post.id} className="p-2 hover:bg-gray-50 rounded">
                  <p className="font-medium">{post.content}</p>
                  <p className="text-sm text-gray-500">
                    by{' '}
                    <span 
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                      onClick={() => post.author?.id && navigate(`/profile/${post.author.id}`)}
                    >
                      {post.author?.profile?.username || post.author?.email}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
