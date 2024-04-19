import React, { useState } from "react";
import { toast } from "sonner";
import { HashLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const ForgotPassPage = () => {
  const [email, setEmailAddress] = useState("");
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    console.log(e.target.value);
    setEmailAddress(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handlePassChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailSubmit = () => {
    // console.log(email);
    if (email) {
      sendCode(email);
      setLoader(true);
    }
  };
  const handleCodeSubmit = () => {
    if (email && code) {
      setLoader(true);
      sendVerification(email, code);
    }
  };
  const handlePasswordSubmit = () => {
    if (verified && email) {
      updatePass(email, password);
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

      const data = await response.json();

      if (response.ok && response.status == 200 && data.sent) {
        setCodeSent(true);

        toast.success("Verification Code Sent!");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Send Code error", error);
    }
    setLoader(false);
  };

  const sendVerification = async (email, code) => {
    try {
      const JSONPayload = JSON.stringify({ email, code });
      console.log(JSONPayload);

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

        console.log(data);

        if (data.verified) {
          setVerified(true);
          toast.success("Verification code valid.");
        } else {
          toast.error(data.error);
        }
      } else if (response.status === 404) {
        alert("Send code error: Code not found");
      } else {
        throw new Error("Failed to verify code");
      }
    } catch (error) {
      console.error("Code error", error);
    }
    setLoader(false);
  };

  const updatePass = async (email, password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasSpecialChar = /[@$!%*?&]/;
    const hasValidLength = /^.{8,20}$/;

    if (!passwordRegex.test(password)) {
      toast.error(`Invalid password parameters`, {
        description: `${
          !hasNumber.test(password) ? "Need at least 1 number</br>" : ""
        }${
          !hasUpperCase.test(password) ? "Need at least 1 Uppercase</br>" : ""
        }${
          !hasSpecialChar.test(password)
            ? "Need at least 1 special character</br>"
            : ""
        }${!hasValidLength.test(password) ? "Need at least 8 characters" : ""}`,
      });
      return;
    }

    try {
      const JSONPayload = JSON.stringify({ email, password });
      console.log(JSONPayload);

      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/updatePassword",
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

        if (data.changed) {
          setPassword("");
          setCode("");
          setEmailAddress("");
          setVerified(false);
          setLoader(false);
          toast.success("Password changed successfully");
          navigate("/login");
        } else {
          toast.error(data.error);
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

  return loader ? (
    <div className="flex flex-col w-full h-full items-center justify-center">
      {" "}
      <HashLoader size={128} color="#36d7b7" />
    </div>
  ) : (
    <div className="flex flex-col w-full h-screen items-center justify-center gap-y-5 ">
      <p className="font-bold text-3xl">Forgot Password?</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {!codeSent ? (
          <div className="flex flex-row gap-x-4 ">
            <input
              placeholder="Enter email address"
              value={email}
              onChange={handleEmailChange}
              className="border border-white rounded-md pl-4 h-20 w-96 text-2xl"
            ></input>
            <button
              type="button"
              className="border border-white bg-eucalyptus-900 w-32 hover:bg-eucalyptus-950"
              onClick={handleEmailSubmit}
            >
              Submit
            </button>
          </div>
        ) : !verified ? (
          <div className="flex flex-row gap-x-4">
            <input
              onChange={handleCodeChange}
              value={code}
              placeholder="Enter Verification Code"
              className="border border-white rounded-md pl-4 h-20 w-96 text-2xl"
            ></input>
            <button
              type="button"
              className="border border-white bg-eucalyptus-900 w-32 hover:bg-eucalyptus-950"
              onClick={handleCodeSubmit}
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-x-4">
            <input
              onChange={handlePassChange}
              value={password}
              placeholder="Enter New Password"
              className="border border-white rounded-md pl-4 h-20 w-96 text-2xl"
            ></input>
            <button
              type="button"
              className="border border-white bg-eucalyptus-900 w-32 hover:bg-eucalyptus-950"
              onClick={handlePasswordSubmit}
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassPage;
