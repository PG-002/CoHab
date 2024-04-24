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
const HousedRoute = ({ userInfo, connected }) => {
  const [loader, setLoader] = useState(true);
  const [housed, setHoused] = useState(false);

  useEffect(() => {
    if (userInfo) {
      if (isHoused(userInfo)) {
        setHoused(true);
      }
      setLoader(false);
    }
  }, [userInfo]);

  return loader && !connected ? (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <HashLoader color="#36d7b7" />
    </div>
  ) : housed ? (
    connected ? (
      <Outlet />
    ) : (
      <div className="flex flex-col w-full h-screen items-center justify-center">
        <p className="font-bold p-10 text-2xl">Socket Connecting</p>
      </div>
    )
  ) : (
    <Navigate to="/joinHouse" />
  ); // If authenticated, render the children components
};

export default HousedRoute;
