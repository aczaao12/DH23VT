import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import LoginView from './pages/LoginPage/LoginView';
import DashboardView from './pages/DashboardPage/DashboardView';
import UploadView from './pages/UploadPage/UploadView';
import AdminView from './pages/AdminPage/AdminView';
import AdminRoute from './components/shared/AdminRoute';
import SettingsView from './pages/SettingsPage/SettingsView';
import BottomNavBar from './components/shared/BottomNavBar';
import useDarkMode from './hooks/useDarkMode';
import ScoreCalculator from './pages/DashboardPage/ScoreCalculator';
import NotificationView from './pages/NotificationPage/NotificationView';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isDarkMode] = useDarkMode();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          const isAdmin = idTokenResult.claims.admin || false;
          setCurrentUser({ ...user, isAdmin });
        } catch (error) {
          console.error("Error getting ID token result:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LoginView />} />
        <Route path="/dashboard" element={currentUser ? <DashboardView handleLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/upload" element={currentUser ? <UploadView /> : <Navigate to="/" />} />
        <Route path="/settings" element={currentUser ? <SettingsView handleLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin" element={<AdminRoute user={currentUser}><AdminView /></AdminRoute>} />
        <Route path="/calculator" element={currentUser ? <ScoreCalculator /> : <Navigate to="/" />} />
        <Route path="/notifications" element={currentUser ? <NotificationView /> : <Navigate to="/" />} />
      </Routes>
      {currentUser && <BottomNavBar />}
    </div>
  );
}

export default App;