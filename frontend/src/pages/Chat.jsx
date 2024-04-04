import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../components/Chat.css";
import Messages from "../components/Messages";
import SendMessageForm from "../components/SendMessageForm";

function Chat({ socket }) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getHouse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: decodedToken.userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          const decoded = jwtDecode(data.token);
          if (decoded && decoded.house) {
            setMessages(decoded.house.groupChat);
          } else {
            // Handle the case where the house is not found
            console.error("House not found:", data.error);
          }
        } else {
          console.error("Invalid response, no token", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching house:", error);
        navigate("/login"); // Redirect on error or handle differently
      });
    console.log("I am being mounted");
  }, [navigate]);

  const decodedToken = jwtDecode(localStorage.getItem("sessionId"));
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("groupChatChange", (data) => {
        // console.log(data.messages);
        setMessages(data.messages);
      });
    }
  }, [socket]);

  const handleSendMessage = (messageContent) => {
    const messageDate = new Date();
    // console.log(messageContent);
    socket.emit("sendMessage", messageContent);
    // console.log("sentBy is " + decodedToken.firstName);
    // console.log("email is " +  decodedToken.email);
    setCurrentMessage("");
  };

  const handleDeleteMessage = (message) => {
    socket.emit("deleteMessage", message);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#ADBC9F] text-black font-bold">
      <h2 className=" bg-white font-bold text-black border-b-2 border white text-xs sm:text-sm md:text-base lg:text-lg ">
        Group Chat
      </h2>
      <div className="message-list-container pt-4 pb-1 flex flex-col justify-between w-full h-full">
        <div>
          <Messages
            messages={messages}
            userID={decodedToken.email}
            onDelete={handleDeleteMessage}
          />
        </div>
      </div>
      <SendMessageForm sendMessage={handleSendMessage} />
    </div>
  );
}

export default Chat;
