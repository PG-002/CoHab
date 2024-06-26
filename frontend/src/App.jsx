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
import ForgotPassPage from "./pages/ForgotPassPage";

import VerifiedRoute from "./components/VerifiedRoute";
import HousedRoute from "./components/HousedRoute";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

function App() {
  Modal.setAppElement("#root");

  const [theme, setTheme] = useState("dark");
  const [session, setSession] = useState(localStorage.sessionId);
  const [houseInfo, setHouseInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketError, setSocketError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [userUpdate, setUserUpdate] = useState(false);

  const colorTheme = theme === "dark" ? "light" : "light";
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
    toast.info("Connecting to Socket");

    connectSocket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
      toast.error(err.message);
    });
    setSocketError(null);
  };

  const handleLogOut = () => {
    socket.disconnect();
    setSocket(null);
    setUser(null);
    setSession(null);
    setEvents(null);
    setHouseInfo(null);

    localStorage.clear();
    toast.info("Logged Out");

    navigate("/login");
  };

  const handleEventSubmit = (event) => {
    socket.emit("createEvent", event);
    toast.success("Event has been created");
  };

  const handleEventUpdate = (event) => {
    socket.emit("modifyEvent", event);
    toast.success("Event has been updated");
  };

  const handleEventDelete = (event) => {
    socket.emit("deleteEvent", event);
    toast.success("Event has been deleted");
  };

  const handleHouseUpdate = (house) => {
    setHouseInfo(house);
    setEvents(house.events);
  };

  useEffect(() => {
    const fetchUserInfo = async (userId) => {
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
          setUserUpdate(false);
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
        console.log("Log out due to userId null");
        handleLogOut();
      }
    }
  }, [userUpdate]);

  useEffect(() => {
    if (houseInfo) {
      setEvents(houseInfo.events);
    }
  }, [houseInfo]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add("dark");

    localStorage.setItem("theme", theme);
  }, [theme, colorTheme]);

  useEffect(() => {
    if (user && !socket && user.houseId) {
      handleLogin();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.once("connect", () => {
        console.log("Socket Connected");
        setConnected(true);
        toast.success("Socket connected");
      });

      socket.on("disconnect", () => {
        setConnected(false);
        toast.error("Socket Disconnected");
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
  }, [socket]);

  return (
    <div className="flex flex-row w-screen">
      <Toaster richColors style={{ textAlign: "left" }} />
      <Routes>
        <Route element={<UnauthenticatedRoute />}>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/forgotPassword"
            element={<ForgotPassPage setUser={setUser} />}
          />

          <Route
            path="/signup"
            element={<SignUpPage setUpdate={setUserUpdate} />}
          />
        </Route>
        <Route element={<AuthenticatedRoute />}>
          <Route
            path="/verifyUser"
            element={<VerficationPage userInfo={user} setUser={setUser} />}
          />
          <Route
            path="/joinHouse"
            userInfo={user}
            element={
              <JoinHome
                userInfo={user}
                setUser={setUser}
                setUpdate={setUserUpdate}
              />
            }
          />
          <Route
            path="/createHouse"
            element={
              <CreateHome
                userInfo={user}
                setUser={setUser}
                setUpdate={setUserUpdate}
              />
            }
          />
          <Route element={<VerifiedRoute userInfo={user} />}>
            <Route
              element={<HousedRoute connected={connected} userInfo={user} />}
            >
              <Route
                element={
                  <SidebarLayout
                    handleLogOut={handleLogOut}
                    userInfo={user}
                    houseInfo={houseInfo}
                    setHouseInfo={handleHouseUpdate}
                    setEvents={setEvents}
                  />
                }
              >
                <Route
                  path="/dashboard"
                  element={
                    <DashboardPage
                      houseInfo={houseInfo}
                      socket={socket}
                      userInfo={user}
                      setHouseInfo={handleHouseUpdate}
                    />
                  }
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
                <Route
                  path="/location"
                  element={<Location socket={socket} userInfo={user} />}
                />
                <Route path="/messages" element={<Chat socket={socket} />} />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      handleLogout={handleLogOut}
                      userInfo={user}
                      houseInfo={houseInfo}
                      setUpdate={setUserUpdate}
                    />
                  }
                />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
