import './Chat.css';
import { useRef, useEffect } from 'react';

function Messages({ messages, userID, onDelete }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <ul className="message-list">
        {messages.map((message, index) => {
          const ownedByCurrentUser = message.sentBy === userID;
          const messageClass = ownedByCurrentUser ? 'my-message' : 'other-message';
          return (
            <li key={index} className={messageClass}>
              {!ownedByCurrentUser && (
                <div className="sender-name">{message.firstName}</div>
              )}
              <div className={`message-bubble ${ownedByCurrentUser ? 'my-bubble' : 'other-bubble'}`}>
                <p>{message.message}</p>
                {ownedByCurrentUser && (
                  <button onClick={() => onDelete(message)} className="delete-button">Delete</button>
                )}
              </div>
            </li>
          );
        })}
        {/* This div is used as a marker to scroll to */}
        <div ref={messagesEndRef} />
      </ul>
    </>
  );
}

export default Messages;
