
import { useState, useEffect } from 'react'// useEffect to make sure authenticated
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';//to use browser to decide chatroom
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import Login from './Login';
import { auth, db, rtdb} from './firebase';//attachments of firebase to get user authentiacted and link app with global database
import { onAuthStateChanged, signOut} from 'firebase/auth';//to make sure user loggen in
import { doc, setDoc, serverTimestamp , onSnapshot} from 'firebase/firestore';//tools to remember every user
import { ref, set, onDisconnect, onValue} from 'firebase/database';//tools to remember every user in RTDB


import './App.css'

function App() {
  const [user, setUser]=useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);//to store user profile to be displayed
  const [theme, setTheme]= useState(localStorage.getItem('cozy-theme') || 'matcha');//to change themes
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const[messages,setMessages]=useState([{id: 1,text: "Hello!", type:"received",time:"10:15 AM"},{id: 2,text: "Hey there!", type:"sent",time:"10:16 AM"}]);

  //to see if anything changed in authentication
  useEffect(()=> {
  let rtdbCleanup = null;
    let handleTabCloseRef = null;
    let targetUserRef = null;
    let unsubscribeUserDoc = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Save profile to Firestore on initial login authentication
        targetUserRef = doc(db, 'users', currentUser.uid);
        await setDoc(targetUserRef, {
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          lastSeen: serverTimestamp(),
        }, { merge: true });
        //to make sure profile set as soon as log in
        unsubscribeUserDoc = onSnapshot(targetUserRef, (docSnap) => {
        if (docSnap.exists()) {
          setCurrentUserProfile(docSnap.data());
        }
       });

        // Presence Logic
        const connectedRef = ref(rtdb, '.info/connected');
        const userStatusRef = ref(rtdb, `/status/${currentUser.uid}`);

        rtdbCleanup = onValue(connectedRef, (snapshot) => {
          if (snapshot.val() === false) {
            return; 
          }

          onDisconnect(userStatusRef)
            .set('offline')
            .then(() => {
              set(userStatusRef, 'online');
            });
        });

        // Window listener to catch tab closure and stamp the Firestore record instantly
        handleTabCloseRef = () => {
          if (targetUserRef) {
            setDoc(targetUserRef, { lastSeen: serverTimestamp() }, { merge: true });
          }
        };
        window.addEventListener('beforeunload', handleTabCloseRef);
        
      } else { 
        setUser(null);
        setCurrentUserProfile(null);
      }
      setLoading(false);
    });
      
    return () => {
      unsubscribe();
      if (rtdbCleanup) rtdbCleanup();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      if (handleTabCloseRef) window.removeEventListener('beforeunload', handleTabCloseRef);
    };
  }, []);

  //to change theme
  useEffect(()=>{
    localStorage.setItem('cozy-theme', theme);
  }, [theme]);

  const handleSendMessage = () => {
    if(!inputText.trim()) return;//makes sure input text has something

    const currenntTime= new Date().toLocaleTimeString([],{hour:'2-digit', minute: '2-digit'});
    const newGenericMessage={
      id: Date.now(),
      text: inputText,
      time: currenntTime, 
      type: 'sent'
    };
    setMessages([...messages, newGenericMessage]);
    setInputText(''); // Clear the input field after sending

  };
  //handle log out
  const handleLogout = async () => {
  try {
    if (user) {
     
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });
      
      
      const userStatusRef = ref(rtdb, `/status/${user.uid}`);
      await set(userStatusRef, 'offline');
    }
  
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

  // Optional: This handles sending when pressing the "Enter" key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };


  //using conditions to make sure app is only returned if user logged in
  if(loading){
    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Loading ChatApp...</h3>
      </div>
    );
  }
  
  if(!user){
    return <Login />;
  }
  
  return (
  <BrowserRouter> 
    <div className="app-outer-wrapper">
      <div className={`app-main-card theme-${theme}`}>
        
        {/* Columns container (Sidebar + Chat Window) */}
        <div className="app-columns">
          <Sidebar  currentTheme={theme} onChangeTheme={setTheme} />
          <Routes>
            <Route path="/" element={<Navigate to="/room/general" replace />} />
            <Route path="/room/:roomId" element={<ChatWindow />} />
            <Route path="/chat/:chatId" element={<ChatWindow />} />
          </Routes>
        </div>

        {/* Continuous bottom tray spanning the entire layout width */}
        <div className="bottom-tray">
          <div className="tray-left">
            <div className="profile-avatar-container">
              <img 
                src={currentUserProfile?.photoURL || 'https://via.placeholder.com/150'} 
                alt="My Profile" 
                className="profile-avatar"
              />
              <span className="profile-badge"></span> {/* Cozy yellow status dot */}
            </div>
            <span className="tray-status-text">chatting...</span>
          </div>
          
          <button onClick={handleLogout} className="btn-bye">
            bye for now
          </button>
        </div>

      </div>
    </div>
  </BrowserRouter>
);
     
}
export default App
