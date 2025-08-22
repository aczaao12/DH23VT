import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import AdminRoute from './components/shared/AdminRoute';
import BottomNavBar from './components/shared/BottomNavBar';
import useDarkMode from './hooks/useDarkMode';
import './App.css';

const LoginView = lazy(() => import('./pages/LoginPage/LoginView'));
const DashboardView = lazy(() => import('./pages/DashboardPage/DashboardView'));
const UploadView = lazy(() => import('./pages/UploadPage/UploadView'));
const AdminView = lazy(() => import('./pages/AdminPage/AdminView'));
const SettingsView = lazy(() => import('./pages/SettingsPage/SettingsView'));
const ScoreCalculator = lazy(() => import('./pages/DashboardPage/ScoreCalculator'));
const NotificationView = lazy(() => import('./pages/NotificationPage/NotificationView'));

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isDarkMode] = useDarkMode();

  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.remove();
    }
  }, []);

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
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LoginView />} />
          <Route path="/dashboard" element={currentUser ? <DashboardView handleLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/upload" element={currentUser ? <UploadView /> : <Navigate to="/" />} />
          <Route path="/settings" element={currentUser ? <SettingsView handleLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/admin" element={<AdminRoute user={currentUser}><AdminView /></AdminRoute>} />
          <Route path="/calculator" element={currentUser ? <ScoreCalculator /> : <Navigate to="/" />} />
          <Route path="/notifications" element={currentUser ? <NotificationView /> : <Navigate to="/" />} />
        </Routes>
      </Suspense>
      {currentUser && <BottomNavBar />}
    </div>
  );
}

export default App;