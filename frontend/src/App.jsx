import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ErrorPage from "./pages/ErrorPage";
import SidebarLayout from "./pages/global/SidebarLayout";
import TodoList from "./pages/TodoList";
import Calendar from "./pages/Calendar";
import Location from "./pages/Location";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import DashboardPage from './pages/DashboardPage';
// import ErrorPage from "./pages/ErrorPage";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { UserProvider } from './components/UserContext';
// import TodoList from './components/TodoList';
import io from 'socket.io-client';
// import Chat from './components/Chat';
// import JoinHome from "./pages/JoinHome";
// import CreateHome from "./pages/CreateHome";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

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
  const socket = io('https://cohab-4fcf8ee594c1.herokuapp.com/',
  {
    transports: ['websocket'],
    auth: {
      token: localStorage.getItem('sessionId'),
    },
  });
  return (
    <div className="flex flex-row w-screen">
      <Router>
        <Routes>
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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasklist" element={<TodoList socket={socket}/>} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/location" element={<Location />} />
              <Route path="/groupChat" element={<Chat socket={socket}/>} /> 
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
