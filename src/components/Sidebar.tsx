import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const icons: Record<string, JSX.Element> = {
  feed: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h10"/>
    </svg>
  ),
  courses: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  assignments: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="12" y2="17"/>
    </svg>
  ),
  practice: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  ),
  events: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  leaderboard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  schools: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  admin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>
  ),
  ai: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
      <circle cx="9" cy="13" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="13" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M9 17c1 1 5 1 6 0"/>
    </svg>
  ),
};

const activeColors: Record<string, string> = {
  feed: 'bg-blue-50 text-blue-600 border-blue-200',
  courses: 'bg-purple-50 text-purple-600 border-purple-200',
  assignments: 'bg-orange-50 text-orange-600 border-orange-200',
  practice: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  events: 'bg-amber-50 text-amber-600 border-amber-200',
  leaderboard: 'bg-rose-50 text-rose-600 border-rose-200',
  schools: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  admin: 'bg-red-50 text-red-600 border-red-200',
  ai: 'bg-teal-50 text-teal-600 border-teal-200',
};

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'feed', label: 'Лента', path: '/feed' },
    { id: 'courses', label: 'Курсы', path: '/courses' },
    { id: 'assignments', label: 'Задания', path: '/assignments' },
    { id: 'practice', label: 'Практика', path: '/practice' },
    { id: 'events', label: 'События', path: '/events' },
    { id: 'leaderboard', label: 'Рейтинг', path: '/leaderboard' },
    { id: 'ai', label: 'ИИ-ассистент', path: '/ai' },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ id: 'schools', label: 'Школы', path: '/schools' });
    menuItems.push({ id: 'admin', label: 'Админ', path: '/admin' });
  }

  const activeId = menuItems.find(item => location.pathname === item.path)?.id || 'feed';

  return (
    <>
      <style>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <aside className="fixed z-[60] glass-effect rounded-3xl p-4 flex flex-col w-[260px] h-[calc(100vh-40px)] top-5 left-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <button 
            onClick={() => navigate('/home')}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl text-white shadow-md hover:scale-105 transition"
          >
            <span className="text-xl font-bold">C</span>
          </button>
          <span className="font-bold text-gray-800 text-lg whitespace-nowrap">
            CodexLearn
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = activeId === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center gap-4 p-3 rounded-2xl transition-all duration-200
                  ${isActive 
                    ? `${activeColors[item.id]} border` 
                    : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                  }
                `}
              >
                <div className={isActive ? 'scale-105' : ''}>
                  {icons[item.id]}
                </div>
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="mt-auto border-t border-gray-200/50 pt-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-2 w-full hover:bg-gray-100/50 rounded-xl transition-colors p-2"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">
                {(user?.profile?.username || user?.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-800">
                {user?.profile?.username || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] text-gray-500">
                {user?.role === 'ADMIN' ? 'Admin Account' : 'Student Account'}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}