import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../firebase";
import './LoginView.css'; // Import the new CSS file

const LoginView = () => {
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <div className="login-container"> {/* Add a container for full page styling */}
      <div className="login-card"> {/* Add a card for the login form */}
        <h1>Login</h1>
        <p>Hãy dùng mail sinh viên để đăng nhập nhé!!!</p> {/* Added text */}
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default LoginView;