import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const JoinHome = ({ userInfo, setUser }) => {
  const [code, setCode] = useState(false);
  const [codeResponse, setCodeResponse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.houseId) {
      navigate("/dashboard");
    }
  }, [userInfo]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (userInfo) {
      handleJoinHouse(JSON.parse(userInfo).email, code);
    } else {
      console.error("user not found");
    }
  };

  const handleJoinHouse = async (email, code) => {
    try {
      const JSONPayload = JSON.stringify({ email, code });

      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/verifyCode",
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

        if (data && data.token) {
          const decoded = jwtDecode(data.token);

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
    setCode(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center gap-4 w-6/12 max-w-[500px]"
      >
        <h2 className="text-xl ">
          Enter your house invite code to join a house.
        </h2>
        <input
          onChange={handleCodeChange}
          className={`w-full h-4/6 p-5 text-2xl rounded-xl ${
            codeResponse ? "border-red-500" : "border-white"
          } border-2`}
          placeholder="House Code"
        ></input>
        <p className={`${codeResponse ? "block" : "hidden"} text-red-500`}>
          Invalid Code! Try again with correct code
        </p>
        <button type="submit" className="bg-green-900 w-6/12 h-3/5">
          Join House
        </button>
        <p>
          Want to create a house?{" "}
          <Link
            to="/createhouse"
            className="text-white dark:text-white hover:underline"
          >
            Click here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default JoinHome;
