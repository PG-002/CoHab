import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import './Chat.css';
import Messages from "./Messages";

function Chat({socket}) {


    const navigate = useNavigate();

    const LogOut = () => {
        localStorage.removeItem("sessionId");
        navigate("/");
    };

    const decodedToken = jwtDecode(localStorage.getItem('sessionId'));
    const currentUserId = decodedToken.user._id;
    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('groupChatChange', (data) => {
        console.log(data.messages.groupChat);
      setMessages(data.messages.groupChat); 
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('groupChatChange');
    };
  }, [socket]);

  const handleKeyDown = (e) => {
    // Check if Enter key is pressed and there is non-whitespace content
    if (e.key === 'Enter' && currentMessage.trim()) {
      e.preventDefault(); // Prevent the default behavior (new line)
      handleSendMessage(); // Send the message
    }
  };

  const handleSendMessage = () => {
    const messageDate = new Date(); 

    socket.emit('sendMessage', 
    {   date: messageDate, 
        message: currentMessage, 
        sentBy: decodedToken.user._id });
    setCurrentMessage(''); 
  };

  const handleDeleteMessage = (message) => {
    socket.emit('deleteMessage', message);
  };

  return (
    <div>
      <h2>Group Chat</h2>
      <div id="message-list">
      <Messages messages={messages} userId={currentUserId} onDelete={handleDeleteMessage} />
      </div>
      <textarea value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)}> </textarea>
      <button onClick={handleSendMessage} disabled={!currentMessage.trim()}> Send </button>
      <button onClick={LogOut}>Log Out</button>
      <button><Link to="/dashboard" className="text-white dark:text-white hover:underline">Dashboard</Link></button>
    </div>
  );
}

export default Chat;
