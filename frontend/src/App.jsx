import LoginPage from "./pages/LoginPage";
import "./App.css";
import SignUpPage from "./pages/SignUpPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardPage from './pages/DashboardPage';
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
    <>
      <Router>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element=
          {
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
