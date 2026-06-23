
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import './App.css'
import ProtectedRoute from './components/ProtextedRoute';



function App() {
  const [inputText, setInputText] = useState('');
  const[messages,setMessages]=useState([{id: 1,text: "Hello!", type:"received",time:"10:15 AM"},{id: 2,text: "Hey there!", type:"sent",time:"10:16 AM"}]);

    

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

  // Optional: This handles sending when pressing the "Enter" key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };
  return (
    <ProtectedRoute>
    <div className="app-container">
     {/*sidebar rendering*/}
      <Sidebar />

      {//main chat window 
}
      <ChatWindow
      messages={messages}
      inputText={inputText}
      setInputText={setInputText}
      onSendMessage={handleSendMessage}
      />
    </div>
    </ProtectedRoute>
    
  )
      
     
}
export default App
