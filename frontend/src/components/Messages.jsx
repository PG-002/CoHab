import "./Chat.css";
import { useRef, useEffect } from "react";
import { Trash } from "lucide-react";

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
      <ul className="message-list px-4">
        {messages.map((message, index) => {
          const ownedByCurrentUser = message.email === userID;
          const messageClass = ownedByCurrentUser
            ? "my-message"
            : "other-message";
          return (
            <li key={index} className={`${messageClass} `}>
              {!ownedByCurrentUser && (
                <div className="sender-name text-blue-500 pl-2">
                  {message.sentBy}
                </div>
              )}
              {ownedByCurrentUser && (
                <Trash
                  onClick={() => onDelete(message)}
                  className="delete-button text-neutral-400 size-5 mr-2 cursor-pointer hover:text-red-500"
                >
                  Delete
                </Trash>
              )}
              <div
                className={`message-bubble ${
                  ownedByCurrentUser ? "my-bubble" : "other-bubble"
                } ${ownedByCurrentUser ? "bg-eucalyptus-500" : "bg-blue-500"}`}
              >
                <p>{message.message}</p>
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
