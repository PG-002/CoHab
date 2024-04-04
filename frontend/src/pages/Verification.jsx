import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerficationPage = ({ setUser }) => {
  const [code, setCode] = useState(null);
  const [codeSent, setCodeSent] = useState(false);
  const [codeResponse, setCodeResponse] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      sendCode(JSON.parse(userInfo).userId);
    } else {
      console.error("user not found");
    }
  };

  const sendCode = async (id) => {
    try {
      const JSONPayload = JSON.stringify({ id });
      console.log(JSONPayload);

      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/sendVerification",
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
        setCodeSent((prevState) => !prevState);
      } else if (response.status === 404) {
        alert("Send code error: User not found");
      } else {
        throw new Error("Failed to send code");
      }
    } catch (error) {
      console.error("Send Code error", error);
    }
  };

  const sendVerification = async (id, code) => {
    try {
      const JSONPayload = JSON.stringify({ id, code });
      console.log(JSONPayload);

      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/verifyUser",
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

        if (data.verified) {
          const user = JSON.parse(localStorage.getItem("userInfo"));
          user.verified = true;
          setUser(user);
          localStorage.setItem("userInfo", JSON.stringify(user));
          console.log(user);
          navigate("/dashboard");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      sendVerification(JSON.parse(userInfo).userId, code);
    } else {
      console.error("user not found");
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-8/12 md:w-6/12 max-w-[700px]"
      >
        <h2 className="text-xl text-center">
          Please verify using a code sent to your provided email address.
        </h2>
        <input
          onChange={handleCodeChange}
          className={`w-full h-4/6 p-5 text-2xl rounded-xl ${
            codeResponse ? "border-red-500" : "border-white"
          } border-2`}
          placeholder="Code"
        ></input>
        <p className={`${codeResponse ? "block" : "hidden"} text-red-500`}>
          Invalid Code! Try again with correct code
        </p>
        <button type="submit" className="bg-green-900 w-6/12 h-3/5">
          Submit Code
        </button>
        {!codeSent ? (
          <p>
            Need a new code?{" "}
            <button
              type="button"
              onClick={handleClick}
              className="text-green-700 dark:text-white hover:underline hover:cursor-pointer bg-transparent border-none focus:outline-none"
            >
              Click here to send another one
            </button>
          </p>
        ) : (
          <p>Code sent! </p>
        )}
      </form>
    </div>
  );
};

export default VerficationPage;
