import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, getRedirectResult, signOut } from 'firebase/auth';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const validDomain = "@st.hcmuaf.edu.vn";
        const allowedEmail = "aczaao12@gmail.com";
        if (user.email.endsWith(validDomain) || user.email === allowedEmail) {
          setUser(user);
        } else {
          signOut(auth).then(() => {
            alert("Chỉ account có domain @st.hcmuaf.edu.vn đựoc phép đăng nhập");
          }).catch((error) => {
            console.error("Error signing out:", error);
          });
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Error getting redirect result:", error);
      }
    };

    handleRedirectResult();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={!user ? <LoginView /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <DashboardView /> : <Navigate to="/" />} />
      <Route path="/upload" element={user ? <UploadView /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;