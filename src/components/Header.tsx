import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

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

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navActions = [
    { icon: <BellIcon />, path: '/notifications', label: 'Уведомления', badge: 3 },
    { icon: <SearchIcon />, path: '/search', label: 'Поиск' },
  ];

  return (
    <header className="fixed top-5 right-10 z-40 h-16 w-auto max-w-2xl">
      <style>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dropdown-enter {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>

      <div className="relative h-full glass-effect rounded-2xl shadow-sm flex items-center justify-end px-5">
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Navigation actions */}
          {navActions.map(({ icon, path, label, badge }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="
                relative w-10 h-10 flex items-center justify-center
                rounded-xl text-gray-500
                hover:bg-gray-100 hover:text-gray-700
                transition-all duration-200
              "
              title={label}
            >
              {icon}
              {badge && (
                <span className="
                  absolute -top-0.5 -right-0.5
                  min-w-[18px] h-[18px] px-1
                  bg-gradient-to-br from-red-400 to-pink-500
                  text-white text-[10px] font-bold
                  rounded-full flex items-center justify-center
                  shadow-sm
                ">
                  {badge}
                </span>
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="
                flex items-center gap-2 px-2 py-1.5
                rounded-xl hover:bg-gray-100
                transition-all duration-200
              "
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">
                  {(user?.profile?.username || user?.email || 'U')[0].toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {user?.profile?.username || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {user?.role === 'ADMIN' ? 'Администратор' : 'Студент'}
                </p>
              </div>
              <ChevronDownIcon />
            </button>

            {/* Dropdown menu */}
            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="
                  absolute right-0 top-full mt-2 w-56
                  glass-effect rounded-xl shadow-lg
                  dropdown-enter z-40
                  overflow-hidden
                ">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsProfileOpen(false);
                      }}
                      className="
                        w-full flex items-center gap-3 px-3 py-2.5
                        rounded-lg text-gray-600
                        hover:bg-gray-100 hover:text-gray-800
                        transition-colors duration-200
                      "
                    >
                      <UserIcon />
                      <span className="text-sm font-medium">Профиль</span>
                    </button>
                    
                    <div className="h-px bg-gray-200 my-1" />
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="
                        w-full flex items-center gap-3 px-3 py-2.5
                        rounded-lg text-red-500
                        hover:bg-red-50 hover:text-red-600
                        transition-colors duration-200
                      "
                    >
                      <LogoutIcon />
                      <span className="text-sm font-medium">Выйти</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}