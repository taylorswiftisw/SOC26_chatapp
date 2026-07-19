import {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

function ChatWindow({ activeRoomID ='general'}) {
  const { roomId, chatId  } = useParams(); // Get the room ID from the URL parameters
  const activeId= roomId || chatId;

    const [messages, setMessages]=useState([]);
    const [roomName, setRoomName]=useState('');
    const [roomNameOwner, setRoomNameOwner] = useState(null);
    const [inputText, setInputText]=useState('');
    const [loading, setLoading]=useState(true);//tracts state if messagees downloading
    const messagesEndRef=useRef(null);//reference pointer to last message
   
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        try {
          // Handles real Firestore objects vs raw dates safely
          const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
          return isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          return ''; // Safe fallback if a timestamp is temporarily null while loading
        }
      };
    //to get text messages and media
   const handleSendMessage = async (mediaFile) => {
  
      if (!inputText.trim() && !mediaFile) return;
      if (!auth.currentUser) return;

      const messagesRef = collection(db, 'rooms', activeId, 'messages');

      
      const messageData = {
        text: inputText,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        senderPhoto: auth.currentUser.photoURL,
        time: serverTimestamp(),
        mediaUrl: null,  // Staged placeholder
        mediaType: null  // Staged placeholder
      };

      //  Handle media files safely
      try{
      if (mediaFile) {
          // personal Cloudinary credentials here
        const CLOUD_NAME = "aocteyt4";
          const UPLOAD_PRESET = "chat_app"; 

          const formData = new FormData();
          formData.append('file', mediaFile);
          formData.append('upload_preset', UPLOAD_PRESET);

          const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
        
          const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Cloudinary upload failed');

          const uploadData = await response.json();
          
          // Update our database payload 
          messageData.mediaUrl = uploadData.secure_url;
          messageData.mediaType = mediaFile.type; 
        }

    
        //  Fire the complete payload off to your Firestore database collection
        await addDoc(messagesRef, messageData);
        
        const roomRef = doc(db, 'rooms', roomId);
        await updateDoc(roomRef, {
        totalMessages: increment(1)
           });
      
        setInputText('');
      } catch (error) {
        console.error("Error saving message payload to Firestore: ", error);
        alert(`🔴 Chat Error: ${error.message}`); }
    };
        useEffect(() => {
          
        
            const messagesRef=collection(db, 'rooms', activeId, 'messages');
            const q=query(messagesRef, orderBy('time', 'asc'));
        
            const unsubscribe=onSnapshot(q, (snapshot) => {
                const messagesData=snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(messagesData);
                setLoading(false);
            });
        
            return () => unsubscribe();
        }, [activeId]);

        useEffect(() => {
    if (!activeId || !auth.currentUser) return;

    
    if (chatId===activeId) {
      // to use if contacts are being accessed
      const contactRef = doc(db, 'users', chatId);
      const unsubscribeContact = onSnapshot(contactRef, (docSnap) => {
        if (docSnap.exists()) {
          setRoomName(docSnap.data().name);
          setRoomNameOwner(activeId)
        }
      });
      return () => unsubscribeContact();
    }
    const roomRef = doc(db, 'rooms', activeId);
    const unsubscribeRoom = onSnapshot(roomRef, async (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        setRoomName(roomData.name);
        setRoomNameOwner(activeId); 
        
        const currentTotal = roomData.totalMessages || 0;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        
        await updateDoc(userRef, {
          [`readCounts.${activeId}`]: currentTotal
        });
      }
    });
    return () => unsubscribeRoom();
      },[activeId, roomId]);
      
        
        

        useEffect(() => {
            messagesEndRef.current?.scrollIntoView ({ behavior: 'smooth' });
            }, [messages]);
        
       
            

return(
       <main className="chat-area">
        <div className="chat-card" >
      <header className="chat-header">
        <h3 style={{ textTransform: 'lowercase' }}>
            {roomNameOwner === activeId && roomName ? `# ${roomName}` : 'loading room...'}

        </h3>
      </header>

      {/* Conditionally show loader indicator or message logs */}
      {loading ? (
        <div className="loading-spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <p>Loading encrypted messages...</p>
        </div>
      ) : (
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.senderId === auth.currentUser?.uid? 'sent' : 'received'}`}>
      
     
      {msg.mediaUrl && msg.mediaType?.startsWith('image/') && (
        <div className="message-media-wrapper" style={{ marginBottom: '6px' }}>
          <img 
            src={msg.mediaUrl} 
            alt="Sent media" 
            style={{ maxWidth: '240px', maxHeight: '240px', borderRadius: '12px', objectFit: 'cover', display: 'block' }} 
          />
        </div>
      )}

      {/* Video Rendering */}
      {msg.mediaUrl && msg.mediaType?.startsWith('video/') && (
        <div className="message-media-wrapper" style={{ marginBottom: '6px' }}>
          <video 
            src={msg.mediaUrl} 
            controls 
            style={{ maxWidth: '240px', maxHeight: '240px', borderRadius: '12px', display: 'block' }} 
          />
        </div>
      )}

      {msg.text && <p className="message-text" style={{ margin: 0 }}>{msg.text}</p>}
      
      <span className="message-time" style={{ fontSize: '0.7rem', opacity: 0.6, display: 'block', textAlign: 'right', marginTop: '4px' }}>
        {formatTime(msg.time)}
      </span>
    </div>
          ))}
          {/* Target marker anchor for scroll tracker */}
          <div ref={messagesEndRef} />
        </div>
      )}

      <MessageInput 
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSendMessage}
      />
      </div>
    </main>
  ); 

}

export default ChatWindow;

