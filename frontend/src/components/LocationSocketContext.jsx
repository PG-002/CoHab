import { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';

// Create the context
export const LocationSocketContext = createContext();

export const LocationSocketProvider = ({ children }) => {
  const [locationSocket, setLocationSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io("https://cohab-4fcf8ee594c1.herokuapp.com/", {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("sessionId"),
      },
    });

    setLocationSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <LocationSocketContext.Provider value={locationSocket}>
      {children}
    </LocationSocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useLocationSocket = () => {
  return useContext(LocationSocketContext);
};
