import { Navigate, Outlet } from "react-router-dom";

const isVerified = () => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    return JSON.parse(userInfo).verified;
  } else {
    console.error("user not found");
  }

  return false;
};

// This is your AuthenticatedRoute component
const VerifiedRoute = () => {
  if (!isVerified()) {
    return <Navigate to="/verifyUser" />;
  }

  return <Outlet />; // If authenticated, render the children components
};

export default VerifiedRoute;
