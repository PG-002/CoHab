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
import { UserProvider } from './components/UserContext';
import TodoList from './components/TodoList';
import io from 'socket.io-client';
import Chat from './components/Chat';

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
  const socket = io('http://localhost:5003',
  {
    transports: ['websocket'],
    auth: {
      token: localStorage.getItem('sessionId'), // Retrieve the token from local storage
    },
  });
  return (
    <>
    <UserProvider>
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
          <Route path="/task" element={
             <ProtectedRoute>
          <TodoList socket={socket}/>
          </ProtectedRoute>
          } />

        <Route path="/chat" element={
             <ProtectedRoute>
          <Chat socket={socket}/>
          </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </UserProvider>
    </>
  );
}

export default App;
