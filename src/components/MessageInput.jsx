import {useState, useEffect, useRef}from'react';
import EmojiPicker from 'emoji-picker-react';

function MessageInput({ inputText, setInputText, onSend }) {
    const[showPicker, setShowPicker]=useState(false);
    const [mediaFile, setMediaFile]= useState(null);
    const[mediaPreview, setMediaPreview]=useState('');
  

    const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTriggerSend();
    }
  };

    const handleEmojiClick = (emojiData) => {
        setInputText((prev) => prev + emojiData.emoji);
    }

    //to handle clicks outside for emoji
   const emojiButtonRef = useRef(null);
   const pickerRef = useRef(null);
   const fileInputRef= useRef(null);

   //local preview
   const hadleFileChange = (e)=> {
    const file =e.target.files[0];
    if(!file) return;

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
   };

   //delete media if user doesnt want to send
   const handleClearMedia =()=> {
    setMediaFile(null);
    setMediaPreview('');
    if(fileInputRef.current) fileInputRef.current.value ='';

   };

   // Wrapper function to clean up local states when a user hits send
  const handleTriggerSend = () => {
    
    if (!inputText.trim() && !mediaFile) return;
    
    onSend(mediaFile); 
    
   
    setShowPicker(false);
    handleClearMedia();
  };

    useEffect(() => {
        const handleGlobalClick = (event) => {
        // ignore clicks on the toggle button itself
        if (emojiButtonRef.current && emojiButtonRef.current.contains(event.target)) {
            return;
        }
         if (pickerRef.current && pickerRef.current.contains(event.target)) { // NEW
        return;
      }
        setShowPicker(false);
        };

        if (showPicker) {
        document.addEventListener('mousedown', handleGlobalClick);
        }

        return () => {
        document.removeEventListener('mousedown', handleGlobalClick);
        };
    }, [showPicker]);


  return (
    <footer className="chat-input-area" style={{position: 'relative', overflow: 'visible'}}>
        {/*  Native File Input Element supporting photos  */}
      <input 
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*,video/*"
        onChange={hadleFileChange}
      />

      {/* Dynamic Media Attachment Preview Dock */}
      {mediaPreview && (
        <div className="media-preview-dock" style={{
          position: 'absolute',
          bottom: '80px',
          left: '24px',
          background: '#FFFFFF',
          padding: '8px',
          borderRadius: '16px',
          border: '1.5px solid var(--matcha-dark)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9,
          boxShadow: '0 8px 24px rgba(56, 69, 54, 0.1)'
        }}>
          {mediaFile?.type.startsWith('video/') ? (
            <video src={mediaPreview} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} muted />
          ) : (
            <img src={mediaPreview} alt="upload preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
          )}
          <button 
            onClick={handleClearMedia}
            style={{ background: 'var(--matcha-dark)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.75rem' }}
            title="Remove Media"
          >
            ✕
          </button>
        </div>
      )}
        {showPicker && (
            <div className="emoji-picker-anchor" 
            ref={pickerRef}
            style={{
            position: 'absolute',
            bottom: '80px',
            left: '24px',
            zIndex: 10,
            boxShadow: '0 8px 30px rgba(56, 69, 54, 0.15)',
            borderRadius: '20px',
            overflow: 'hidden'
                }}>
              <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            searchDisabled={false}
            skinTonesDisabled={false}
            height={350}
            width={320}
          />  
            </div>
        )}



      <div className="chat-input-pill">
        
       
        <button className="icon-btn" title="Add Picture" onClick={() => fileInputRef.current.click()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', color: 'var(--matcha-dark)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>

       
        <button className="icon-btn" title="Add Emoji" onClick={() => setShowPicker((prev) => !prev)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', marginRight: '6px', color: 'var(--matcha-dark)'  }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </button>

     
        <input 
          type="text" 
          placeholder="type a message..." 
          className="main-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button className="btn-cozy-send"  onClick={handleTriggerSend} title="Send Message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>

      </div>
    </footer>
  );
}

export default MessageInput;