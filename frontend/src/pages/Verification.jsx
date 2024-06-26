import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerficationPage = ({ userInfo, setUser }) => {
  const [code, setCode] = useState(null);
  const [codeSent, setCodeSent] = useState(false);
  const [codeResponse, setCodeResponse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("sessionId");

    if (session) {
      if (userInfo) {
        if (userInfo.verified) {
          navigate("/dashboard");
        }
      }
    }
  }, [userInfo]);

  const handleClick = () => {
    if (userInfo) {
      sendCode(userInfo.email);
    } else {
      console.error("user not found");
    }
  };

  const sendCode = async (email) => {
    try {
      const JSONPayload = JSON.stringify({ email });

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
        toast.success("Verification Code Sent!");
      } else if (response.status === 404) {
        alert("Send code error: User not found");
      } else {
        throw new Error("Failed to send code");
      }
    } catch (error) {
      console.error("Send Code error", error);
    }
  };

  const sendVerification = async (email, code) => {
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

        if (data.verified) {
          const user = userInfo;
          user.verified = true;
          setUser(user);
          toast.success("Verification Successful");
          navigate("/dashboard");
        } else {
          setCodeResponse(data.error);
        }
      } else if (response.status === 404) {
        alert("Send code error: User not found");
        toast.error("User not found");
      } else {
        toast.error(data.error);

        throw new Error("Failed to send code");
      }
    } catch (error) {
      toast.error(error.message);

      console.error("Send Code error", error);
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInfo) {
      sendVerification(userInfo.email, code);
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
          placeholder="Verification Code"
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
