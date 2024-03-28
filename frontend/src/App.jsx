import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar, { SidebarItem } from "./pages/global/Sidebar";
import { LayoutDashboard } from "lucide-react";
import SidebarDev from "./pages/SidebarDev";
import SidebarLayout from "./pages/global/SidebarLayout";
import ProtectedRoutes from "./components/ProtectedRoute";
import Tasklist from "./pages/Tasklist";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

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

const isAuthenticated = () => {
  const sessionId =
    sessionStorage.getItem("sessionId") || localStorage.getItem("sessionId");
  // You might also want to validate that the session ID is still valid on the server-side
  return sessionId !== null; // Returns true if there is a sessionId
};

function App() {
  return (
    <div className="flex flex-row w-screen">
      <Router>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginPage />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" /> : <SignUpPage />
            }
          />
          <Route element={<ProtectedRoutes />}>
            <Route element={<SidebarLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasklist" element={<Tasklist />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />\
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
