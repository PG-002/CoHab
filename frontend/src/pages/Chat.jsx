import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../components/Chat.css";
import Messages from "../components/Messages";
import SendMessageForm from "../components/SendMessageForm";

function Chat({ socket }) {
  const navigate = useNavigate();

  const decodedToken = jwtDecode(localStorage.getItem("sessionId"));
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [houseName, setHouseName] = useState(""); 


  useEffect(() => {
    const fetchTasks = async () => {
      const sessionId = localStorage.getItem("sessionId");
  
      if (!sessionId) {
        navigate("/login"); // Redirect to login if no session
        return;
      }
  
      try {
        const decodedToken = jwtDecode(sessionId);
        const userId = decodedToken.userId;
  
        const response = await fetch(
          "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getHouse",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
  
        const data = await response.json();
        
        if (data.token) {
          const houseData = jwtDecode(data.token); // Decode the house data from the token
          setMessages(houseData.house.groupChat); 
          setHouseName(houseData.house.houseName);
        } else {
          console.error("House not found:", data.error);
          navigate("/login"); // Redirect to login or handle error state
        }
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        navigate("/login"); // Redirect to login or handle error
      }
    };
  
    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    if (socket) {
      socket.on("groupChatChange", (data) => {
        // console.log(data.messages);
        setMessages(data.messages);
      });
    }
  }, [socket]);

  const handleSendMessage = (messageContent) => {
    socket.emit("sendMessage", messageContent);
    setCurrentMessage("");
  };

  const handleDeleteMessage = (message) => {
    socket.emit("deleteMessage", message);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#ADBC9F] text-black font-bold">
      {/* <h2 className=" bg-white font-bold text-black border-b-2 border white text-xs sm:text-sm md:text-base lg:text-lg ">
        Group Chat
      </h2> */}
      <div className="message-list-container pt-4 pb-1 flex flex-col justify-between w-full h-full">
        <div>
          <Messages
            messages={messages}
            userID={decodedToken.email}
            onDelete={handleDeleteMessage}
          />
        </div>
      </div>
      <SendMessageForm sendMessage={handleSendMessage} houseName={houseName} />
    </div>
  );
}

export default Chat;
