import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const sessionId = sessionStorage.getItem('sessionId') || localStorage.getItem('sessionId');
  return sessionId !== null; // Returns true if there is a sessionId
};

// This is your ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;
