import { jwtDecode } from "jwt-decode";
import test from "../assets/test.jpg";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import CoHablogo from "../assets/CoHab.png";
import { toast } from "sonner";

const SignUpPage = ({ setUpdate }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [TakenEmail, setTakenEmail] = useState(false);
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  const handleEmailChange = (e) => {
    setTakenEmail(false);
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handlefirstNameChange = (e) => setFirstName(e.target.value);
  const handlelastNameChange = (e) => setLastName(e.target.value);

  const hasNumber = /\d/;
  const hasUpperCase = /[A-Z]/;
  const hasSpecialChar = /[@$!%*?&]/;
  const hasValidLength = /^.{8,20}$/;

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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (!passwordRegex.test(password)) {
      passwordInputRef.current.focus();
      setIsFocused(true);
      return;
    }

    try {
      const JSONPayload = JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });

      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/signup",
        {
          // this is just for now, eventually will need to do actual URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // has to follow same format as in UserController.js
          body: JSONPayload,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("sessionId", token);

        const decoded = jwtDecode(token);
        setUpdate(decoded);
        toast.success("Signed Up!");
        sendCode(email);

        navigate("/dashboard");
      } else {
        toast.error("Failed");
        throw new Error("Failed to register");
      }
    } catch (error) {
      setTakenEmail(true);
      console.error("Registration error", error);
      toast.error("Registration error", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPass((prevState) => !prevState);
  };

  const handleFocus = () => {
    setIsFocused(!isFocused);
  };

  const validateRequirement = (pattern) => {
    return pattern.test(password);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <img className="object-fit w-48" src={CoHablogo} />
        <div className="w-full flex items-center justify-center ">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black dark:text-white text-center">
              Sign Up
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 dark:text-gray-400 text-center">
              Join to Our Community with all time access and free{" "}
            </h1>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                First Name
              </label>
              <input
                required
                type="text"
                value={firstName}
                onChange={handlefirstNameChange}
                className="mt-1 p-2 w-full text-black dark:text-white bg-white dark:bg-neutral-800 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Last Name
              </label>
              <input
                required
                type="text"
                value={lastName}
                onChange={handlelastNameChange}
                className="mt-1 p-2 w-full text-black dark:text-white bg-white dark:bg-neutral-800 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="mt-1 p-2 w-full text-black dark:text-white bg-white dark:bg-neutral-800 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              {TakenEmail && (
                <p className="text-red-500 text-sm mt-1">
                  There is already an account with this email.
                </p>
              )}
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPass ? "text" : "password"}
                  ref={passwordInputRef}
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={handleFocus}
                  onBlur={handleFocus}
                  className="mt-1 p-2 w-full text-black dark:text-white bg-white dark:bg-neutral-800 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
                {isFocused && (
                  <div className="text-red-600 text-sm mt-1">
                    <ul className="text-sm">
                      <li
                        className={
                          validateRequirement(hasNumber)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        Must contain a number
                      </li>
                      <li
                        className={
                          validateRequirement(hasValidLength)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        Must be 8-20 characters
                      </li>
                      <li
                        className={
                          validateRequirement(hasUpperCase)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        Must contain an uppercase letter
                      </li>
                      <li
                        className={
                          validateRequirement(hasSpecialChar)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        Must contain a special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-900 text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                Sign Up
              </button>
            </form>
            <hr className="mt-4"></hr>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-black dark:text-white hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
