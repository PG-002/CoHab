import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { HashLoader } from "react-spinners";

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
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (userInfo) {
      if (!isHoused(userInfo)) {
        return <Navigate to="/joinHouse" />;
      }
      setLoader(null);
    }
  }, [userInfo]);

  return loader ? <HashLoader color="#36d7b7" /> : <Outlet />; // If authenticated, render the children components
};

export default HousedRoute;
