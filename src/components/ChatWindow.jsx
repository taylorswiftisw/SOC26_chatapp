import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

function ChatWindow({messages, inputText, setInputText, onSendMessage}) {
    return(
        <main className="chat-area">
            <header className="chat-header">
                <h3> Jane Doe</h3>

            </header>

            <div className="message-list">
                {
                    messages.map((msg) => (
                        <MessageBubble 
                        key={msg.id}
                        text={msg.text}
                        time={msg.time}
                        type={msg.type}
                        />
                    ))}
                
            </div>
            
               <MessageInput 
        inputText={inputText}
        setInputText={setInputText}
        onSend={onSendMessage}
      />
    </main>
  ); 
}

export default ChatWindow;


