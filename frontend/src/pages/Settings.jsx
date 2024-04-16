import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";

function Settings({ userInfo, houseInfo, setUpdate }) {
  // Page state variables
  const [editProfile, setEditProfile] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [verifiedPass, setVerifiedPass] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // User Information State
  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmailAddress] = useState("");
  const [houseName, setHouseName] = useState("");
  const [locationOn, setLocationOn] = useState(false);

  useEffect(() => {
    if (userInfo && houseInfo) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setEmailAddress(userInfo.email);
      setLocationOn(userInfo.location.isTracking);
      setHouseName(houseInfo.houseName);
      setId(userInfo.userId);
    }
  }, [userInfo, houseInfo]);

  const handleEditProfile = () => {
    setEditProfile(true);
  };

  const handleEditPassword = () => {
    setEditPassword(true);
  };

  const handleLocationChange = () => {
    setLocationOn((prev) => !prev);
    const location = userInfo.location;
    location.isTracking = !locationOn;

    submitUserChanges(id, "location", location);
  };

  const handlePasswordUpdate = () => {};

  const handleNameUpdate = (e) => {
    e.preventDefault();

    setFirstName(e.target.firstName.value);
    setLastName(e.target.lastName.value);

    submitUserChanges(id, "firstName", e.target.firstName.value);
    submitUserChanges(id, "lastName", e.target.lastName.value);
    setEditProfile(false);
  };

  const submitUserChanges = async (userId, fieldName, fieldValue) => {
    try {
      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/updateUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId, fieldName, fieldValue }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      const data = await response.json();

      if (data.updated) {
        setUpdate(true);
      } else {
        console.error("Update failed!".data.error);
      }
    } catch (error) {
      console.error("Error fetching user:", error.message);
      navigate("/login"); // Redirect to login or handle error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white dark:bg-neutral-800">
      <div className="flex flex-col justify-start gap-10 w-[400px] sm:w-[500px] md:w-[700px] h-[700px]  py-4 px-8  rounded-lg bg-neutral-100 dark:bg-neutral-900 shadow-md dark:shadow-gray-900 border-gray-200 dark:border-neutral-700 border-2 overflow-y-auto">
        <div className="flex flex-col justify-evenly w-full">
          <h2 className="font-bold text-xl text-neutral-600 dark:text-white">
            Profile:{" "}
          </h2>
          <hr className="mt-2 border-neutral-400 dark:border-white "></hr>
        </div>
        {editProfile ? (
          <form onSubmit={handleNameUpdate}>
            <div className="flex flex-row justify-evenly">
              <div className="flex flex-col">
                <p className="font-bold text-left pl-1 text-neutral-600 dark:text-white">
                  First Name
                </p>
                <input
                  defaultValue={firstName}
                  name="firstName"
                  className="pl-2 rounded border-[1px] h-10 bg-neutral-200 border-gray-300 dark:border-none shadow-sm dark:bg-neutral-700 text-neutral-600 dark:text-white "
                ></input>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-left pl-1 text-neutral-600 dark:text-white">
                  Last Name
                </p>
                <input
                  defaultValue={lastName}
                  name="lastName"
                  className="pl-2 rounded border-[1px] h-10 bg-neutral-200 border-gray-300 dark:border-none shadow-sm dark:bg-neutral-700 text-neutral-600 dark:text-white "
                ></input>
              </div>
            </div>
            <button
              type="submit"
              className="text-xs sm:text-sm mt-4 bg-eucalyptus-600 dark:bg-eucalyptus-950"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <div className="flex flex-row justify-evenly items-center">
              <div className="flex flex-col">
                <p className="font-bold text-left pl-1 text-neutral-600 dark:text-white">
                  First Name
                </p>
                <p className="text-left pl-1 rounded text-neutral-600 dark:text-white ">
                  {firstName}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-left pl-1 text-neutral-600 dark:text-white">
                  Last Name
                </p>
                <p className="text-left pl-1 rounded text-neutral-600 dark:text-white ">
                  {lastName}
                </p>
              </div>
              <Edit
                className="cursor-pointer"
                onClick={handleEditProfile}
              ></Edit>
            </div>
          </div>
        )}
        <form className="">
          <div className="flex flex-col justify-evenly w-full gap-2">
            <h2 className="font-bold text-xl text-neutral-600 dark:text-white">
              Security:{" "}
            </h2>
            <hr className="mb-4 border-neutral-400 dark:border-white"></hr>
            {codeSent ? (
              <p className="text-left text-eucalyptus-700">Code Sent!</p>
            ) : null}
            <div className="flex flex-row justify-evenly md:justify-evenly items-center">
              <p className="font-bold text-neutral-600 dark:text-white">
                Email
              </p>
              {editEmail ? (
                <div className="flex flex-row w-[300px] md:w-[500px] h-10 justify-end gap-2">
                  {verifiedEmail ? (
                    <>
                      {" "}
                      <input
                        defaultValue={email}
                        className="rounded border-[1px] pl-2 w-4/6 bg-neutral-200 border-gray-300 dark:border-none shadow-sm dark:bg-neutral-700 text-neutral-600 dark:text-white"
                      ></input>
                      <button
                        type="button"
                        className="text-xs sm:text-xs bg-eucalyptus-600 dark:bg-eucalyptus-950"
                      >
                        Update
                      </button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <input
                        className="rounded border-[1px] pl-2 w-4/6 bg-neutral-200 border-gray-300 dark:border-none shadow-sm dark:bg-neutral-700 text-neutral-600 dark:text-white"
                        placeholder="Enter Verification Code"
                      ></input>
                      <button
                        type="button"
                        className="text-xs sm:text-xs bg-eucalyptus-600 dark:bg-eucalyptus-950"
                      >
                        Send Code
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-left pl-1 rounded text-neutral-600 dark:text-white ">
                    {email}
                  </p>
                  {/* <Edit
                    className="cursor-pointer"
                    onClick={handleEditEmail}
                  ></Edit> */}
                </>
              )}
            </div>
            <div className="flex flex-row py-2 justify-evenly md:justify-evenly items-center">
              <p className="font-bold text-neutral-600 dark:text-white">
                Change Password
              </p>
              {editPassword ? (
                <div className="flex flex-row w-[300px]  md:w-[500px] h-10 justify-end gap-2">
                  {verifiedPass ? (
                    <>
                      {" "}
                      <input className="rounded border-[1px] pl-2 w-4/6 bg-neutral-200 border-gray-300 dark:border-none shadow-sm dark:bg-neutral-700 text-neutral-600 dark:text-white"></input>
                      <button
                        type="button"
                        className="text-xs sm:text-xs bg-eucalyptus-600 dark:bg-eucalyptus-950"
                      >
                        Update
                      </button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <input
                        className="rounded border-[1px] pl-2 w-4/6 bg-neutral-200 border-gray-300 dark:border-none shadow-sm dark:bg-neutral-700 text-neutral-600 dark:text-white"
                        placeholder="Enter Verification Code"
                      ></input>
                      <button
                        type="button"
                        className="text-xs sm:text-xs bg-eucalyptus-600 dark:bg-eucalyptus-950"
                      >
                        Send Code
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Edit
                    className="cursor-pointer"
                    onClick={handleEditPassword}
                  ></Edit>
                </>
              )}
            </div>
            <div className="pt-4 flex flex-row items-center justify-evenly">
              <p className="font-bold text-neutral-600 dark:text-white">
                Location Tracking:
              </p>
              <div>
                <label className="flex items-center relative w-max cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={locationOn}
                    onChange={handleLocationChange}
                    className="peer appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500 checked:bg-green-500"
                  />
                  <span className="absolute font-medium text-xs uppercase right-1 text-white">
                    {" "}
                    OFF{" "}
                  </span>
                  <span className="absolute font-medium text-xs uppercase right-8 text-white">
                    {" "}
                    ON{" "}
                  </span>
                  <label className="pointer-events-none w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200 peer-checked:translate-x-7" />
                </label>
              </div>
            </div>
          </div>
        </form>
        <div className="flex flex-col">
          {" "}
          <p className="text-xl text-neutral-600 dark:text-white font-bold">
            Other:{" "}
          </p>
          <hr className="mb-10 mt-2 border-neutral-400 dark:border-white"></hr>
          <div className="flex flex-row items-center justify-evenly">
            <div className="flex flex-row gap-2">
              <p className="font-bold text-neutral-600 dark:text-white">
                Current House:
              </p>
              <p className=" text-neutral-600 dark:text-white">{houseName}</p>
            </div>
            <button
              type="button"
              className="text-xs sm:text-sm bg-red-500 dark:bg-red-900"
            >
              Leave House
            </button>
          </div>
        </div>

        {/* <div className="pt-4 flex flex-row items-center justify-evenly">
          <p className="font-bold text-neutral-600 dark:text-white">
            Close Account:
          </p>
          <button
            type="button"
            className="text-xs sm:text-sm bg-red-500 dark:bg-red-900"
          >
            DELETE ACCOUNT
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Settings;
