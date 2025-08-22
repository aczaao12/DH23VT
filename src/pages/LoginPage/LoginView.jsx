import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "../../firebase";
import { useEffect } from "react";
import './LoginView.css'; // Import the new CSS file

const LoginView = () => {
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
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default LoginView;