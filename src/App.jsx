import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import AdminView from './components/AdminView';
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Fixed initialization

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => { // Added 'async'
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true); // Force refresh
          const isAdmin = idTokenResult.claims.admin || false; // Get admin claim
          setCurrentUser({ ...user, isAdmin }); // Set enhanced user object
        } catch (error) {
          console.error("Error getting ID token result:", error);
          setCurrentUser(user); // Fallback to original user if error
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
    // Removed <Router> as App is already wrapped by BrowserRouter in main.jsx
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LoginView />} />
      <Route path="/dashboard" element={currentUser ? <DashboardView /> : <Navigate to="/" />} />
      <Route path="/upload" element={currentUser ? <UploadView /> : <Navigate to="/" />} />
      <Route path="/admin" element={<AdminRoute user={currentUser}><AdminView /></AdminRoute>} /> {/* Passed user prop */}
      {/* Add new route here */}
    </Routes>
  );
}

export default App;