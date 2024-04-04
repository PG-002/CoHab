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
          setMessages(houseData.house.groupChat); // Ensure you are retrieving the right property
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

  // useEffect(() => {
  //   fetch("https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getHouse", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ userId: decodedToken.userId }),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (data.house) {
  //         setMessages(data.house.groupChat);
  //       } else {
  //         // Handle the case where the house is not found
  //         console.error("House not found:", data.error);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching house:", error);
  //       navigate("/login"); // Redirect on error or handle differently
  //     });
  //   console.log("I am being mounted");
  // }, [navigate]);

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
    <div className="message-list-container">
      <h2>Group Chat</h2>
      <div>
        <Messages
          messages={messages}
          userID={decodedToken.email}
          onDelete={handleDeleteMessage}
        />
      </div>
      <div className="chat-container">
        <SendMessageForm sendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;
