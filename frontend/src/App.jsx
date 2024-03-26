import "./App.css";
import LoginPage from "./pages/login-signup/LoginPage";
import SignUpPage from "./pages/login-signup/SignUpPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ErrorPage from "./pages/global/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Calendar from "./pages/calendar/Calendar";
import Chat from "./pages/chat/Chat";
import Tasklist from "./pages/tasklist/Tasklist";
import Settings from "./pages/settings/Settings";

if (localStorage.theme === "dark" || !("theme" in localStorage)) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

if (localStorage.theme === "dark") {
  localStorage.theme = "light";
} else {
  localStorage.theme = "dark";
}

function App() {
  return (
    <div className="flex">
      <Router>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/dashboard/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/tasklist"
            element={
              <ProtectedRoute>
                <Tasklist />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
