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


    socket.on('groupChatChange', (data) => {
      console.log(data.messages);
      setMessages(data.messages); 
  });

  const handleSendMessage = (messageContent) => {
    const messageDate = new Date(); 
    console.log(messageContent);
    socket.emit('sendMessage', messageContent);
        // console.log("sentBy is " + decodedToken.firstName);
        // console.log("email is " +  decodedToken.email);
    setCurrentMessage(''); 
  };

  const handleDeleteMessage = (message) => {
    socket.emit('deleteMessage', message);
  };

  return (
    <div className="message-list-container">
      <h2>Group Chat</h2>
      <div>
      <Messages messages={messages} userID={decodedToken.email} onDelete={handleDeleteMessage} />
      </div>
      <div className='chat-container'>
      <SendMessageForm sendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;