import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import JoinHome from "./pages/JoinHome";
import CreateHome from "./pages/CreateHome";
import DashboardPage from "./pages/DashboardPage";
import ErrorPage from "./pages/ErrorPage";
import SidebarLayout from "./pages/global/SidebarLayout";
import TodoList from "./pages/TodoList";
import Calendar from "./pages/Calendar";
import Location from "./pages/Location";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import VerficationPage from "./pages/Verification";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

import VerifiedRoute from "./components/VerifiedRoute";
import HousedRoute from "./components/HousedRoute";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";

function App() {
  Modal.setAppElement("#root");

  const [theme, setTheme] = useState(localStorage.theme ?? "dark");
  const [session, setSession] = useState(localStorage.sessionId);
  const [houseInfo, setHouseInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketError, setSocketError] = useState(null);

  const colorTheme = theme === "dark" ? "light" : "dark";
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Connecting to Socket");
    const connectSocket = io("https://cohab-4fcf8ee594c1.herokuapp.com/", {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("sessionId"),
      },
    });

    setSocket(connectSocket);
    setSocketError(null);
  };

  const handleLogOut = () => {
    socket.disconnect();
    localStorage.clear();

    navigate("/login");
  };

  const handleEventSubmit = (event) => {
    socket.emit("createEvent", event);
  };

  const handleEventUpdate = (event) => {
    socket.emit("modifyEvent", event);
  };

  const handleEventDelete = (event) => {
    socket.emit("deleteEvent", event);
  };

  const handleHouseUpdate = (house) => {
    setHouseInfo(house);
    setEvents(house.events);
  };

  useEffect(() => {
    const fetchUserInfo = async (userId) => {
      if (!userId) {
        handleLogOut();
        navigate("/login"); // Redirect to login if no session
        return;
      }

      try {
        const response = await fetch(
          "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getUserInfo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();

        if (data.token) {
          localStorage.setItem("sessionId", data.token);
          const decoded = jwtDecode(data.token);
          const user = decoded;
          setUser(user);
          navigate("/dashboard");
        } else {
          console.error("User not found:", data.error);
          navigate("/login"); // Redirect to login or handle error state
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
        navigate("/login"); // Redirect to login or handle error
      }
    };

    if (localStorage.getItem("sessionId")) {
      const decoded = jwtDecode(localStorage.getItem("sessionId"));

      const userId = decoded.userId;

      if (userId) {
        fetchUserInfo(userId);
      } else {
        handleLogOut();
      }
    }
  }, []);

  useEffect(() => {
    if (houseInfo) {
      setEvents(houseInfo.events);
    }
  }, [houseInfo]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme ?? "dark");

    localStorage.setItem("theme", theme);
  }, [theme, colorTheme]);

  useEffect(() => {
    if (user && !socket) {
      handleLogin();
    }

    if (socket) {
      socket.once("connect", () => {
        console.log("Socket Connected");
      });

      socket.on("disconnect", () => {
        console.log("Socket Disconnected");
      });

      socket.on("connect_error", (err) => {
        setSocketError(err?.message);
        console.log(err?.message);
      });

      socket.on("error", (err) => {
        setSocketError(err?.message);
        console.log(err?.message);
      });

      socket.on("eventsChange", (e) => {
        setEvents(e.events);
      });
    }

    return () => {
      socket?.off();
      socket?.disconnect();
    };
  }, [socket, user]);

  return (
    <div className="flex flex-row w-screen">
      <Routes>
        <Route element={<UnauthenticatedRoute />}>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
        </Route>
        <Route element={<AuthenticatedRoute />}>
          <Route
            path="/verifyUser"
            element={<VerficationPage userInfo={user} setUser={setUser} />}
          />
          <Route
            path="/joinHouse"
            userInfo={user}
            element={<JoinHome setUser={setUser} />}
          />
          <Route
            path="/createHouse"
            element={<CreateHome userInfo={user} setUser={setUser} />}
          />
          <Route element={<VerifiedRoute userInfo={user} />}>
            <Route element={<HousedRoute userInfo={user} />}>
              <Route
                element={
                  <SidebarLayout
                    userInfo={user}
                    houseInfo={houseInfo}
                    setHouseInfo={handleHouseUpdate}
                    setEvents={setEvents}
                  />
                }
              >
                <Route
                  path="/dashboard"
                  element={<DashboardPage houseInfo={houseInfo} />}
                />
                <Route
                  path="/tasklist"
                  element={<TodoList socket={socket} />}
                />
                <Route
                  path="/calendar"
                  element={
                    <Calendar
                      events={events}
                      addEvent={handleEventSubmit}
                      updateEvent={handleEventUpdate}
                      deleteEvent={handleEventDelete}
                    />
                  }
                />
                <Route path="/location" element={<Location />} />
                <Route path="/messages" element={<Chat socket={socket} />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
