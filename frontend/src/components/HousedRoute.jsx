import { Navigate, Outlet } from "react-router-dom";

const isHoused = (userInfo) => {
  if (userInfo) {
    return userInfo.houseId;
  } else {
    console.error("user not found");
  }

  return false;
};

// This is your AuthenticatedRoute component
const HousedRoute = ({ userInfo }) => {
  if (!isHoused(userInfo)) {
    return <Navigate to="/joinHouse" />;
  }

  return <Outlet />; // If authenticated, render the children components
};

export default HousedRoute;
