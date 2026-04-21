import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MobileAppbar from '../components/MobileAppbar';
import Home from './Home';
import Profile from './Profile';
import Courses from './Courses';
import Assignments from './Assignments';
import Practice from './Practice';
import Events from './Events';
import Notifications from './Notifications';
import AIChat from './AIChat';
import Search from './Search';
import Schools from './Schools';
import Feed from './Feed';
import Leaderboard from './Leaderboard';
import Admin from './Admin';

export default function Dashboard() {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case '/home':
        return <Home />;
      case '/':
        return <Home />;
      case '/feed':
        return <Feed />;
      case '/profile':
        return <Profile />;
      case '/courses':
        return <Courses />;
      case '/assignments':
        return <Assignments />;
      case '/practice':
        return <Practice />;
      case '/events':
        return <Events />;
      case '/notifications':
        return <Notifications />;
      case '/leaderboard':
        return <Leaderboard />;
      case '/search':
        return <Search />;
      case '/ai':
        return <AIChat />;
      case '/schools':
        return <Schools />;
      case '/admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  const tabNames: Record<string, string> = {
    '/home': 'Главная',
    '/': 'Главная',
    '/feed': 'Лента',
    '/profile': 'Профиль',
    '/courses': 'Курсы',
    '/assignments': 'Задания',
    '/practice': 'Практика',
    '/events': 'События',
    '/notifications': 'Уведомления',
    '/leaderboard': 'Рейтинг',
    '/search': 'Поиск',
    '/ai': 'AI',
    '/schools': 'Школы',
    '/admin': 'Админ',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Mobile Appbar */}
      <div className="md:hidden">
        <MobileAppbar />
      </div>
      
      {/* Main Content */}
      <div className="md:ml-[280px] md:pt-20 pt-4 pb-20 md:pb-8 px-4 md:px-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{tabNames[location.pathname] || location.pathname}</h1>
        {renderContent()}
      </div>
    </div>
  );
}
