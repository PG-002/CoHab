import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ErrorPage from "./pages/ErrorPage";
import SidebarLayout from "./pages/global/SidebarLayout";
import Tasklist from "./pages/Tasklist";
import Calendar from "./pages/Calendar";
import Location from "./pages/Location";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import JoinHome from "./pages/JoinHome";
// import CreateHome from "./pages/CreateHome";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { useEffect, useState } from "react";
import EventModal from "./components/EventsModal";
import Modal from "react-modal";
import io from "socket.io-client";

// if (localStorage.theme === "dark" || !("theme" in localStorage)) {
//   document.documentElement.classList.add("dark");
// } else {
//   document.documentElement.classList.remove("dark");
// }

// if (localStorage.theme === "dark") {
//   localStorage.theme = "light";
// } else {
//   localStorage.theme = "dark";
// }

function App() {
  Modal.setAppElement("#root");
  const localHouseInfo = localStorage.getItem("houseInfo")
    ? JSON.parse(localStorage.getItem("houseInfo"))
    : {};

  const localEventInfo = localStorage.getItem("eventsInfo")
    ? JSON.parse(localStorage.getItem("eventsInfo"))
    : {};

  const localUserInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("eventsInfo"))
    : null;

  const [houseInfo, setHouseInfo] = useState(localHouseInfo);
  const [user, setUser] = useState(localUserInfo);
  const [events, setEvents] = useState(localEventInfo);
  const [socket, setSocket] = useState(null);
  const [socketError, setSocketError] = useState(null);

  const handleLogin = () => {
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
  };

  useEffect(() => {
    if (user && !socket) {
      handleLogin();
    }

    if (socket) {
      socket.once("connect", () => {
        console.log("Socket Connected");
      });

      socket.on("disconnet", () => {
        console.log("Socket Disconnected");
      });

      socket.on("error", (err) => {
        setSocketError(err?.message);
        console.log(err?.message);
      });

      socket.on("eventsChange", (e) => {
        setEvents(e.events);
        localStorage.setItem("eventsInfo", JSON.stringify(e.events));
      });
    }

    return () => {
      socket?.off();
      socket?.disconnect();
    };
  }, [socket, user]);

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
    localStorage.setItem("eventsInfo", JSON.stringify(house.events));
    localStorage.setItem("houseInfo", JSON.stringify(house));
  };

  return (
    <div className="flex flex-row w-screen">
      <Router>
        <Routes>
          <Route
            path="/componentDev"
            element={
              <EventModal
                selectedEvent={events ? events[0] : null}
              ></EventModal>
            }
          />
          <Route element={<UnauthenticatedRoute />}>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
          <Route element={<AuthenticatedRoute />}>
            {/* <Route path="/joinhouse" element={<JoinHome />} />
            <Route path="/createhouse" element={<CreateHome />} /> */}
            <Route
              element={
                <SidebarLayout
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
              <Route path="/tasklist" element={<Tasklist />} />
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
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
