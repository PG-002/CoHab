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
  useEffect(() => {
    if (userInfo) {
      if (!isVerified(userInfo)) {
        return <Navigate to="/verifyUser" />;
      }
      setLoader(false);
    }
  }, [userInfo]);

  return loader ? (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <HashLoader color="#36d7b7" />{" "}
    </div>
  ) : (
    <Outlet />
  ); // If authenticated, render the children components
};

export default VerifiedRoute;
