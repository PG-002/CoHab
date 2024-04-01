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
import Datepicker from "./components/DatePicker";
import Modal from "react-modal";
// import { socket } from "./socket";

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
  // const [isConnected, setIsConnected] = useState(socket.connected);
  Modal.setAppElement("#root");
  const localHouseInfo = localStorage.getItem("houseInfo")
    ? JSON.parse(localStorage.getItem("houseInfo"))
    : {};

  const localEventInfo = localStorage.getItem("eventsInfo")
    ? JSON.parse(localStorage.getItem("eventsInfo"))
    : {};

  const [houseInfo, setHouseInfo] = useState(localHouseInfo);
  const [events, setEvents] = useState(localEventInfo);

  const handleEventUpdate = (eventList) => {
    const parsedList = [];
    eventList.map((event) => {
      parsedList.push({
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        description: event.extendedProps.description,
      });
    });
    setEvents(parsedList);
    console.log(parsedList);
    localStorage.setItem("eventsInfo", JSON.stringify(parsedList));
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
                selectedEvent={
                  JSON.parse(localStorage.getItem("eventsInfo"))[0]
                }
              ></EventModal>
            }
          />
          <Route element={<UnauthenticatedRoute />}>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
          <Route element={<AuthenticatedRoute />}>
            {/* <Route path="/joinhouse" element={<JoinHome />} />
            <Route path="/createhouse" element={<CreateHome />} /> */}
            <Route element={<SidebarLayout />}>
              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    houseInfo={houseInfo}
                    setHouseInfo={handleHouseUpdate}
                  />
                }
              />
              <Route path="/tasklist" element={<Tasklist />} />
              <Route
                path="/calendar"
                element={
                  <Calendar events={events} updateEvents={handleEventUpdate} />
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
