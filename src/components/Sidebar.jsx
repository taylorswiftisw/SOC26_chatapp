import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom'; // 1. Import navigation tools
import { db, auth, rtdb } from '../firebase';
import {ref, onValue} from 'firebase/database';

function Sidebar({ activeRoomID, currentTheme, onChangeTheme }) {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses]=useState({});//stores whether user online or offline

  const navigate = useNavigate(); // Navigation function to change the URL programmatically
  const { roomId, chatId } = useParams(); 


  useEffect(() => {
    const usersRef=collection(db, 'users');
    const unsubscribeUsers= onSnapshot(usersRef, (snapshot) => {
      const fetchedUsers=snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(fetchedUsers);
   

    //loop through users and register status
     fetchedUsers.forEach((user)=> {
      const userStatusRef=ref(rtdb, `/status/${user.id}`);
      onValue(userStatusRef, (statusSnapshot) => {
        const currentStatus=statusSnapshot.val()|| 'offline';
        setStatuses((prevStatuses) => ({
          ...prevStatuses,
          [user.id]: currentStatus
        }));
      });
      });
    });


    const roomsRef = collection(db, 'rooms');
    const unsubscribe = onSnapshot(roomsRef, (snapshot) => {
      const fetchedRooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(fetchedRooms);
    });

    return () =>{ unsubscribeUsers();
      unsubscribe(); };
    
  }, []);
  

  //creating new folder to map to new room
  const handleCreateRoom = async () => {
    const roomName = prompt("Enter new room name:");
    if (!roomName || !roomName.trim()) return;

    const roomsRef = collection(db, 'rooms');
    await addDoc(roomsRef, {
      name: roomName.trim(),
      createdBy: auth.currentUser?.uid,
      createdAt: serverTimestamp()
    });
  };

  

          return (
    <aside className="sidebar">
      
      {/* 🎨 Theme Selector Swatches */}
      <div className="theme-selector-top">
        <span className="theme-label" style={{ color: '#ffffff' }}> theme: </span>
        <div className="theme-dots_container"> 
          <button onClick={() => onChangeTheme('matcha')} style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#849680', border: currentTheme === 'matcha' ? '2px solid white' : '1px solid rgba(250, 248, 245, 0.2)', cursor: 'pointer' }} title="Matcha Green" />
          <button onClick={() => onChangeTheme('lavender')} style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#AC9FBB', border: currentTheme === 'lavender' ? '2px solid white' : '1px solid rgba(250, 248, 245, 0.2)', cursor: 'pointer' }} title="Lavender Purple" />
          <button onClick={() => onChangeTheme('peach')} style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#EAB198', border: currentTheme === 'peach' ? '2px solid white' : '1px solid rgba(250, 248, 245, 0.2)', cursor: 'pointer' }} title="Sunset Peach" />
          <button onClick={() => onChangeTheme('rose')} style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#D9A5B3', border: currentTheme === 'rose' ? '2px solid white' : '1px solid rgba(250, 248, 245, 0.2)', cursor: 'pointer' }} title="Soft Rose" />
        </div>
      </div>

      {/* rooms row with mascot and add button*/}
      <div className="cozy-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="leaf-bean-mascot" style={{ marginLeft: '10px' }}>
            <div className="leaf-bean-eyes"></div>
            <div className="leaf-bean-blush"></div>
          </div>
          <h2>rooms</h2>
        </div>
        <button className="btn-cozy-add" onClick={handleCreateRoom} title="Create a Room">+</button>
      </div>

      {/* scorllable stuff */}
      <div className="sidebar-scrollable">
        
        {/* rooms list  */}
        <div className="cosy-list" style={{ padding: '0 12px' }}>
          {rooms.map((room) => {
            const isActive = roomId === room.id;
            
            const myProfile = users.find(u => u.id === auth.currentUser?.uid);
            const myReadCount = myProfile?.readCounts?.[room.id] || 0;
            const totalRoomMessages = room.totalMessages || 0;
            const unreadCount = Math.max(0, totalRoomMessages - myReadCount);
            return (
              <div
                key={room.id}
                className={`cozy-card ${isActive ? 'active' : ''}`}
                onClick={() => navigate(`/room/${room.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  // 🔑 Ultra-sleek glass layout: subtle background change combined with sharp borders
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.20)' : 'rgba(255, 255, 255, 0.05)',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '0.9rem', 
                  fontWeight: isActive ? '600' : '400',
                  color: '#ffffff',
                  textTransform: 'lowercase'
                }}>
                  {room.name}
                </h4>

                {unreadCount > 0 && (
                  <span style={{
                    backgroundColor: '#ffffff',
                    color: 'var(--matcha-dark, #849680)', 
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '20px'
                  }}>
                    {room.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <hr className="cozy-divider" />
        
        {/*  contacts header */}
        <div className="cozy-header" style={{ padding: '8px 20px' }}>
          <h2>contacts</h2>
        </div>

        {/*  contacts list  */}
        <div className="cosy-list" style={{ padding: '0 12px' }}>
          {users.map((contact) => {
            if (contact.id === auth.currentUser?.uid) return null;
            const isActive = chatId === contact.id;

            return (
              <div 
                key={contact.id} 
                className={`cozy-card ${isActive ? 'active' : ''}`} 
                onClick={() => navigate(`/chat/${contact.id}`)} 
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.20)' : 'rgba(255, 255, 255, 0.05)',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 14px', 
                  borderRadius: '12px',
                  marginBottom: '6px',
                  width: '100%',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={contact.photoURL || 'https://via.placeholder.com/150'} 
                    alt={contact.name} 
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid white' }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    border: '1px solid rgba(132, 150, 128, 1)', 
                    backgroundColor: statuses[contact.id] === 'online' ? 'var(--presence-online)' : 'rgba(250, 248, 245, 0.4)'
                  }} />
                </div>
                <div style={{ marginLeft: '12px' }}>
                  <h4 style={{ 
                    fontSize: '0.9rem', 
                    margin: 0, 
                    fontWeight: isActive ? '600' : '400',
                    color: '#ffffff',
                    textTransform: 'lowercase'
                  }}>
                    {contact.name}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;