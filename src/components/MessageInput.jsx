function MessageInput({inputText,setInputText, onSend}) {
    const handleKeyPress =(event) => {
         if(event.key==='Enter'){
            onSend();
         }};

         return (
            <footter className="chat-input-area">
                <buttion className="icon-btn">⚉</buttion>
                <buttion className="icon-btn"> ⟟ </buttion>
                <input 
                type="text" 
                placeholder="Type a message..." 
                className="main-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
            />

            <button className="send-btn" onClick={onSend}>
                ᯓ➤
            </button>
            </footter>
         );
         
    }
    export default MessageInput;