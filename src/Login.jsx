
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

function Login() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Welcome to ChatApp</h2>
      <button onClick={handleGoogleSignIn} style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;