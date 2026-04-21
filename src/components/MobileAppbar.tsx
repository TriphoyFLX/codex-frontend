import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const icons: Record<string, JSX.Element> = {
  feed: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h10"/>
    </svg>
  ),
  courses: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  assignments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
    </svg>
  ),
  practice: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  events: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  leaderboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  schools: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  admin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/>
    </svg>
  ),
  ai: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
      <circle cx="9" cy="13" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="13" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M9 17c1 1 5 1 6 0"/>
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  more: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/>
      <circle cx="12" cy="5" r="1"/>
      <circle cx="12" cy="19" r="1"/>
    </svg>
  ),
};

const activeColors: Record<string, string> = {
  feed: 'text-blue-600',
  courses: 'text-purple-600',
  assignments: 'text-orange-600',
  practice: 'text-emerald-600',
  events: 'text-amber-600',
  leaderboard: 'text-rose-600',
  schools: 'text-indigo-600',
  admin: 'text-red-600',
  ai: 'text-teal-600',
  profile: 'text-gray-600',
  more: 'text-gray-600',
};

export default function MobileAppbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Core navigation items for mobile
  const coreItems = [
    { id: 'feed', label: 'Feed', path: '/feed' },
    { id: 'courses', label: 'Courses', path: '/courses' },
    { id: 'assignments', label: 'Tasks', path: '/assignments' },
    { id: 'profile', label: 'Profile', path: '/profile' },
  ];

  // Additional items for "more" menu
  const additionalItems = [
    { id: 'practice', label: 'Practice', path: '/practice' },
    { id: 'events', label: 'Events', path: '/events' },
    { id: 'leaderboard', label: 'Rating', path: '/leaderboard' },
    { id: 'ai', label: 'AI', path: '/ai' },
  ];

  // Add admin items if user is admin
  if (user?.role === 'ADMIN') {
    additionalItems.push({ id: 'schools', label: 'Schools', path: '/schools' });
    additionalItems.push({ id: 'admin', label: 'Admin', path: '/admin' });
  }

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const activeId = location.pathname === '/profile' ? 'profile' : 
                  coreItems.find(item => location.pathname === item.path)?.id || 
                  additionalItems.find(item => location.pathname === item.path)?.id || 'feed';

  return (
    <>
      <style>{`
        .mobile-appbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .mobile-appbar-item {
          transition: all 0.2s ease;
        }
        
        .mobile-appbar-item:active {
          transform: scale(0.95);
        }
        
        .more-menu {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Main Appbar */}
      <div className="mobile-appbar fixed bottom-0 left-0 right-0 z-[60] md:hidden">
        <div className="flex justify-around items-center py-2 px-1">
          {coreItems.map((item) => {
            const isActive = activeId === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`mobile-appbar-item flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] ${
                  isActive ? activeColors[item.id] : 'text-gray-500'
                }`}
              >
                <div className={isActive ? 'scale-110' : ''}>
                  {icons[item.id]}
                </div>
                <span className="text-[10px] font-medium leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
          
          {/* More Menu Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`mobile-appbar-item flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] ${
              showMoreMenu ? activeColors.more : 'text-gray-500'
            }`}
          >
            <div className={showMoreMenu ? 'scale-110' : ''}>
              {icons.more}
            </div>
            <span className="text-[10px] font-medium leading-tight">
              More
            </span>
          </button>
        </div>

        {/* More Menu Overlay */}
        {showMoreMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 z-[59]"
              onClick={() => setShowMoreMenu(false)}
            />
            
            {/* More Menu */}
            <div className="more-menu fixed bottom-20 left-4 right-4 rounded-2xl p-4 z-[60]">
              <div className="grid grid-cols-3 gap-3">
                {additionalItems.map((item) => {
                  const isActive = activeId === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setShowMoreMenu(false);
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                        isActive 
                          ? `${activeColors[item.id]} bg-gray-100` 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={isActive ? 'scale-110' : ''}>
                        {icons[item.id]}
                      </div>
                      <span className="text-xs font-medium text-center leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

