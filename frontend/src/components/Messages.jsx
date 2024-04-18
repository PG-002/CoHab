import "./Chat.css";
import 'react';
import { useRef, useEffect, Fragment } from "react";
import { Trash } from "lucide-react";

function Messages({ messages, userID, onDelete }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function formatDateForSeparator(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    });
  }

  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.date.split('T')[0]; // Get only the date part
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Sort the groups by date
  const sortedDates = Object.keys(groupedMessages).sort();

  return (
    <>
      <ul className="message-list px-4">
        {sortedDates.map((date, dateIndex) => (
          <Fragment key={date}>
            {/* Render the date separator */}
            {dateIndex > 0 && <div className="date-separator">{formatDateForSeparator(date)}</div>}
            {/* Render the messages for this date */}
            {groupedMessages[date].map((message, messageIndex) => {
              const ownedByCurrentUser = message.email === userID;
              const messageClass = ownedByCurrentUser ? "my-message" : "other-message";
              const messageTime = formatTime(message.date);

              return (
                <li key={messageIndex} className={`${messageClass} `}>
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
                }`}
              >
                <p className="message">{message.message}</p>
                <p className="messageTime">{messageTime}</p>
              </div>
            </li>
              );
            })}
          </Fragment>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    </>
  );
}

export default Messages;
