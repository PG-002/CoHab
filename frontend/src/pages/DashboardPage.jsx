import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardPage = ({ houseInfo, setHouseInfo }) => {
  useEffect(() => {
    const fetchHouseInfo = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
        const JSONPayload = JSON.stringify({
          userId: userId,
        });
        const response = await fetch(
          "http://https://cohab-4fcf8ee594c1.herokuapp.com/api/users/gethouse",
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
          setHouseInfo(data.house);
        } else if (response.status === 404) {
          alert("Login failed: User not found");
        } else {
          throw new Error(response.status);
        }
      } catch (error) {
        console.error("Login error", error);
      }
    };
    fetchHouseInfo();
  }, []);

  return <div className="w-screen text-left overflow-hidden text-white"></div>;
};

export default DashboardPage;
