import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  const sessionId =
    sessionStorage.getItem("sessionId") || localStorage.getItem("sessionId");
  // You might also want to validate that the session ID is still valid on the server-side
  return sessionId !== null; // Returns true if there is a sessionId
};

const UnauthenticatedRoute = () => {
  if (isAuthenticated()) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />; // If authenticated, render the children components
};

export default UnauthenticatedRoute;
