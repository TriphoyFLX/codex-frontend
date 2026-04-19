import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import SchoolSelection from './pages/SchoolSelection';
import EventDetail from './pages/EventDetail';
import CourseDetail from './pages/CourseDetail';
import LessonDetail from './pages/LessonDetail';
import PublicProfile from './pages/PublicProfile';

function AppContent() {
  const { isAuthenticated, hasProfile, hasSchool, refreshUser } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!hasSchool) {
    return <SchoolSelection onComplete={refreshUser} />;
  }

  if (!hasProfile) {
    return <ProfileSetup onComplete={refreshUser} />;
  }

  return (
    <Routes>
      <Route path="/home" element={<Dashboard />} />
      <Route path="/feed" element={<Dashboard />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/courses" element={<Dashboard />} />
      <Route path="/assignments" element={<Dashboard />} />
      <Route path="/practice" element={<Dashboard />} />
      <Route path="/events" element={<Dashboard />} />
      <Route path="/leaderboard" element={<Dashboard />} />
      <Route path="/notifications" element={<Dashboard />} />
      <Route path="/search" element={<Dashboard />} />
      <Route path="/ai" element={<Dashboard />} />
      <Route path="/profile" element={<Dashboard />} />
      <Route path="/schools" element={<Dashboard />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/events/:eventId" element={<EventDetail />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/courses/:courseId/lessons/:stageId" element={<LessonDetail />} />
      <Route path="/profile/:userId" element={<PublicProfile />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
