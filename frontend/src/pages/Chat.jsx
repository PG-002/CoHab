import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import '../components/Chat.css';
import Messages from "../components/Messages";
import SendMessageForm from "../components/SendMessageForm";

function Chat({socket}) {


    const navigate = useNavigate();

    const LogOut = () => {
        localStorage.removeItem("sessionId");
        navigate("/");
    };

    const decodedToken = jwtDecode(localStorage.getItem('sessionId'));
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

  const handleSendMessage = (messageContent) => {
    const messageDate = new Date(); 

    socket.emit('sendMessage', 
    {   date: messageDate, 
        message: messageContent, 
        sentBy: decodedToken.user._id,
        firstName : decodedToken.user.firstName });
        console.log("sentBy is " + decodedToken.user._id);
        console.log("ID is " +  decodedToken.user._id);
    setCurrentMessage(''); 
  };

  const handleDeleteMessage = (message) => {
    socket.emit('deleteMessage', message);
  };

  return (
    <div className="message-list-container">
      <h2>Group Chat</h2>
      <div>
      <Messages messages={messages} userID={decodedToken.user._id} onDelete={handleDeleteMessage} />
      </div>
      <div className='chat-container'>
      <SendMessageForm sendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;