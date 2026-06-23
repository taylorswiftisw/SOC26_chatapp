import { useAuth } from "../context/AuthContext";
import Login from "../Login";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If there is no user, block the screen and render the Login component instead
  if (!user) {
    return <Login />;
  }

  // If user exists, go ahead and let them see the child components
  return children;
}

export default ProtectedRoute;