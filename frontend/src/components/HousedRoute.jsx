import { Navigate, Outlet } from "react-router-dom";

const isHoused = () => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    return JSON.parse(userInfo).houseId;
  } else {
    console.error("user not found");
  }

  return false;
};

// This is your AuthenticatedRoute component
const HousedRoute = () => {
  if (!isHoused()) {
    return <Navigate to="/joinHouse" />;
  }

  return <Outlet />; // If authenticated, render the children components
};

export default HousedRoute;
