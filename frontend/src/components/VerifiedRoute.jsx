import { Navigate, Outlet } from "react-router-dom";

const isVerified = (userInfo) => {
  if (userInfo) {
    return userInfo.verified;
  } else {
    console.error("user not found");
  }

  return false;
};

// This is your AuthenticatedRoute component
const VerifiedRoute = ({ userInfo }) => {
  if (!isVerified(userInfo)) {
    return <Navigate to="/verifyUser" />;
  }

  return <Outlet />; // If authenticated, render the children components
};

export default VerifiedRoute;
