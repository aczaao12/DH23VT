import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import AdminView from './components/AdminView';
import AdminRoute from './components/AdminRoute';
import SettingsView from './components/SettingsView';
import BottomNavBar from './components/BottomNavBar';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LoginView />} />
        <Route path="/dashboard" element={currentUser ? <DashboardView /> : <Navigate to="/" />} />
        <Route path="/upload" element={currentUser ? <UploadView /> : <Navigate to="/" />} />
        <Route path="/settings" element={currentUser ? <SettingsView /> : <Navigate to="/" />} />
        <Route path="/admin" element={<AdminRoute user={currentUser}><AdminView /></AdminRoute>} />
      </Routes>
      {currentUser && <BottomNavBar />}
    </>
  );
}

export default App;
