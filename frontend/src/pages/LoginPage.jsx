import test from "../assets/test.jpg";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Sidebar, { SidebarItem } from "./global/Sidebar";
import { LayoutDashboard } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import CoHablogo from "../assets/CoHab.png";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setLoginError(false);
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setLoginError(false);
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const JSONPayload = JSON.stringify({
        email: email,
        password: password,
      });

      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/login",
        {
          // Adjust URL as necessary
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSONPayload,
        }
      );

      if (response.ok && response.status == 201) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("sessionId", token);

        const decoded = jwtDecode(token);
        setUser(decoded);

        navigate("/dashboard");
      } else if (response.status === 404) {
        setLoginError(true);
        // alert("Login failed: User not found");
      } else {
        setLoginError(true);
        throw new Error("Failed to log in");
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div className="flex flex-row w-screen">
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100 dark:bg-neutral-900">
        <img className="object-fit w-48" src={CoHablogo} />
        <div className="w-full flex items-center justify-center ">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black dark:text-white text-center">
              Log In
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="mt-1 p-2 w-full border text-black dark:text-white bg-white dark:bg-neutral-800 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
                {loginError && (
                  <p className="text-red-500 text-sm mt-1">
                    Your email or password is incorrect.
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  required
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="mt-1 p-2 w-full border text-black dark:text-white bg-white dark:bg-neutral-800 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
                {loginError && (
                  <p className="text-red-500 text-sm mt-1">
                    Your email or password is incorrect.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-green-900 text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                Login
              </button>
            </form>

            <hr className="mt-4"></hr>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-black dark:text-white hover:underline"
                >
                  Sign up here
                </Link>
              </p>
              <p>
                Forgot password?{" "}
                <Link
                  to="/forgotPassword"
                  className="text-black dark:text-white hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
