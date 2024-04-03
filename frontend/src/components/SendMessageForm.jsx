import './SendMessageForm.css';
import { useState } from 'react';

function SendMessageForm({ sendMessage }) {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage)
     {
        sendMessage(message);  
        setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="send-message-form">
      <input
        className="message-input"
        onChange={handleChange}
        value={message}
        placeholder="Type your message and hit ENTER"
        type="text"
      />
    </form>
  );
}

export default SendMessageForm;
