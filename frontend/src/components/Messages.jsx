function Messages({ messages, currentUserId, onDelete }) {
    return (
      <ul className="message-list">
        {messages.map((message, index) => {
          const ownedByCurrentUser = message.senderId === currentUserId;
          return (
            <li key={index}>
              <div>{message.sentBy}</div>
              <div>{message.message}</div>
              {ownedByCurrentUser && (
                <button onClick={() => onDelete(message)}>Delete</button>
              )}
            </li>
          );
        })}
      </ul>
    );
}

  export default Messages;