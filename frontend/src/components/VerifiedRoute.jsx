import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { HashLoader } from "react-spinners";

const isVerified = (userInfo) => {
  if (userInfo) {
    return userInfo.verified;
  } else {
    console.log("User info not loaded");
  }

  return false;
};

// This is your AuthenticatedRoute component
const VerifiedRoute = ({ userInfo }) => {
  const [loader, setLoader] = useState(true);
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    if (userInfo) {
      if (isVerified(userInfo)) {
        setVerified(true);
      }
      setLoader(false);
    }
  }, [userInfo]);

  return loader ? (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <HashLoader color="#36d7b7" />{" "}
    </div>
  ) : verified ? (
    <Outlet />
  ) : (
    <Navigate to="/verifyUser" />
  ); // If authenticated, render the children components
};

export default VerifiedRoute;
