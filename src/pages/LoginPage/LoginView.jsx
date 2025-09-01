import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "../../firebase";
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import useInAppBrowserDetection from '../../hooks/useInAppBrowserDetection';
import BrowserWarningBanner from '../../components/shared/BrowserWarningBanner';
import './LoginView.css'; // Import the new CSS file

const LoginView = () => {
  const isInAppBrowser = useInAppBrowserDetection();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // This will give you the Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("User from redirect:", user);
          console.log("Token from redirect:", token);
        }
      } catch (error) {
        console.error("Error during redirect result:", error);
      }
    };
    checkRedirectResult();
  }, []);
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <div className="login-container"> {/* Add a container for full page styling */}
      <div className="login-card"> {/* Add a card for the login form */}
        <h1>Login</h1>
        <p>Hãy dùng mail sinh viên để đăng nhập nhé!!!</p> {/* Added text */}
        {isInAppBrowser && (
          <BrowserWarningBanner message="Vui lòng mở ứng dụng này trong trình duyệt bên ngoài (ví dụ: Chrome, Safari) để có trải nghiệm tốt nhất và đăng nhập thành công." />
        )}
        <button onClick={handleGoogleLogin} disabled={isInAppBrowser}>Sign in with Google</button>
        <p className="privacy-policy-link-container">
          <Link to="/privacy-policy">Chính sách bảo mật</Link>
        </p>
        <p className="terms-of-service-link-container">
          <Link to="/terms-of-service">Điều khoản dịch vụ</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginView;