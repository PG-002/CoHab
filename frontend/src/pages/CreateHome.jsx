import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CreateHome = ({ userInfo, setUser }) => {
  const [houseName, setHouseName] = useState(null);
  const [codeResponse, setCodeResponse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.houseId) {
      navigate("/dashboard");
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (userInfo) {
      handleCreateHouse(userInfo.userId, houseName);
    } else {
      console.error("user not found");
    }
  };

  const handleCreateHouse = async (userId, houseName) => {
    try {
      const JSONPayload = JSON.stringify({ userId, houseName });

      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/houses/createHouse",
        {
          // Adjust URL as necessary
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSONPayload,
        }
      );

      if (response.ok && response.status == 200) {
        const data = await response.json();
        console.log(data);

        if (data && data.token) {
          const decoded = jwtDecode(data.token);
          console.log(decoded);

          if (decoded && decoded.house) {
            const user = userInfo;
            user.houseId = decoded.house._id;
            setUser(user);

            console.log(user);
            navigate("/dashboard");
          } else {
            setCodeResponse(data.error);
          }
        } else {
          setCodeResponse(data.error);
        }
      } else if (response.status === 404) {
        alert("Send code error: User not found");
      } else {
        throw new Error("Failed to send code");
      }
    } catch (error) {
      console.error("Send Code error", error);
    }
  };

  const handleCodeChange = (e) => {
    setHouseName(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center gap-4 w-6/12 max-w-[500px]"
      >
        <h2 className="text-xl ">
          To create a house, just enter your house name below.
        </h2>
        <input
          onChange={handleCodeChange}
          className="w-full h-4/6 p-5 text-2xl rounded-xl border-white border-2"
          placeholder="House Name"
        ></input>
        <button type="submit" className="bg-green-900 w-6/12 h-3/5">
          Create House
        </button>
        <p>
          Want to join a house?{" "}
          <Link
            to="/joinhouse"
            className="text-white dark:text-white hover:underline"
          >
            Click here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default CreateHome;
