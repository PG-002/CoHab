import "./SendMessageForm.css";
import { useState } from "react";

function SendMessageForm({ sendMessage, houseName }) {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="send-message-form">
      <input
        className="message-input text-neutral-500 dark:text-white bg-white dark:bg-neutral-700 rounded shadow-md dark:shadow-gray-900 border-neutral-300 dark:border-neutral-600 border-[1px]"
        onChange={handleChange}
        value={message}
        placeholder={`Send Message`}
        type="text"
      />
    </form>
  );
}

export default SendMessageForm;
