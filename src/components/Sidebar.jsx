import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Sidebar() {
  const { user } = useAuth(); // Hook into our auth context data stream

  return (
    <aside className="sidebar">
      {/* Dynamic Profile Header Section */}
      <div className="user-profile-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px' }}>
        <img 
          src={user?.photoURL || "https://via.placeholder.com/40"} 
          alt="Profile Avatar" 
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
        <div style={{ flexGrow: 1 }}>
          <h4 style={{ margin: 0 }}>{user?.displayName || "Anonymous User"}</h4>
        </div>
        <button onClick={() => signOut(auth)} style={{ fontSize: '0.8rem' }}>Log Out</button>
      </div>
      
      <hr style={{ opacity: 0.2, margin: '0 0 10px 0' }} />

      <div className="logo-area"><h2>💬 ChatApp</h2></div>
      
      {/* ... the rest of your hardcoded contact cards structure ... */}
    </aside>
  );
}

export default Sidebar;