import { Link, useNavigate } from "react-router-dom";
import SmallCalendar from "../components/Dashboard/SmallCalendar";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Slider from "@mui/material/Slider";
import {
  Thermometer,
  CloudRainWind,
  Wind,
  EarOff,
  Ear,
  PlusSquare,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import sunny from "../assets/sunny.jpg";
import day from "../assets/day.jpg";
import rain from "../assets/rain.jpg";
import night from "../assets/night.jpg";
import shark from "../assets/shark.png";

import EmblaCarousel from "../components/Dashboard/Carousel/EmblaCarousel";
import Modal from "react-modal";
import { toast } from "sonner";
import { RingLoader } from "react-spinners";

dayjs.extend(localizedFormat);

const DashboardPage = ({ userInfo, houseInfo, socket, setHouseInfo }) => {
  const [date, setDate] = useState(dayjs());
  const [events, setEvents] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [messages, setMessages] = useState(null);
  const [weather, setWeather] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(null);
  const [houseUpdate, setHouseUpdate] = useState(false);
  const [background, setBackground] = useState(null);
  const [addRoommate, setAddRoommate] = useState(false);
  const [email, setEmail] = useState("");
  const [houseMates, setHouseMates] = useState(null);
  const [roommateLoading, setRoommateLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async (userId) => {
      try {
        const response = await fetch(
          "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getUserInfo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();

        if (data.token) {
          const decoded = jwtDecode(data.token);
          return decoded;
        } else {
          console.error("User not found:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    const fetchUsers = async (status) => {
      let temp = [];
      const statuses = await Promise.all(
        status.map(async (item) => await fetchUserInfo(item.userId))
      );

      return statuses;
    };

    if (houseInfo) {
      const status = houseInfo.statuses;
      let tempArray = [];

      fetchUsers(status).then((statuses) => {
        statuses.map(({ firstName, lastName, status, userId, email }) => {
          if (userId == userInfo.userId) {
            // console.log("Match");
            tempArray.push({ firstName, lastName, status, userId, email });
          } else {
            // console.log("no match", userInfo.userId);
            tempArray.push({ firstName, lastName, status, userId, email });
          }
        });
        setHouseMates(tempArray);
        setRoommateLoading(false);
      });
    }
  }, [houseInfo]);

  useEffect(() => {
    const fetchWeather = async (long, lat) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${
            lat ?? 28.5383
          }&longitude=${
            long ?? -81.3792
          }&current=temperature_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather info");
        }

        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchHouseInfo = async () => {
      try {
        const userId = userInfo.userId;
        const JSONPayload = JSON.stringify({
          userId: userId,
        });
        const response = await fetch(
          "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getHouse",
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
          if (data.token) {
            const decoded = jwtDecode(data.token);
            setHouseInfo(decoded.house);
          } else {
            console.error("Invalid Response, no token");
          }
        } else if (response.status === 404) {
          alert("House Fetch failed: User not found");
        } else {
          throw new Error(response.status);
        }
      } catch (error) {
        console.error("House Fetch error", error);
      }
    };

    if (userInfo) {
      fetchHouseInfo();
    }
    if (userInfo) {
      fetchWeather(userInfo.location.longitude, userInfo.location.latitude);
    }
  }, [userInfo]);

  useEffect(() => {
    if (houseInfo) {
      setEvents(houseInfo.events);
      setNoiseLevel(houseInfo.noiseLevel);
      setTasks(houseInfo.tasks);
      setMessages(houseInfo.groupChat);
      console.log(houseInfo);
    }
  }, [houseInfo]);

  useEffect(() => {
    const fetchHouseInfo = async () => {
      try {
        const userId = userInfo.userId;
        const JSONPayload = JSON.stringify({
          userId: userId,
        });
        const response = await fetch(
          "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getHouse",
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
          if (data.token) {
            const decoded = jwtDecode(data.token);
            setHouseInfo(decoded.house);
          } else {
            console.error("Invalid Response, no token");
          }
        } else if (response.status === 404) {
          alert("House Fetch failed: User not found");
        } else {
          throw new Error(response.status);
        }
      } catch (error) {
        console.error("House Fetch error", error);
      }
    };

    if (houseUpdate) {
      if (userInfo) {
        fetchHouseInfo();
      }
    }
  }, [houseUpdate]);

  useEffect(() => {
    if (noiseLevel == 10) {
      setBackground(shark);
    } else if (weather) {
      const condition = weatherCodes[weather.current.weather_code];
      if (condition == "sunny") {
        setBackground(sunny);
      } else if (condition == "day") {
        setBackground(day);
      } else if (condition == "rain") {
        setBackground(rain);
      }
    }
  }, [weather, noiseLevel]);

  const handleSliderChange = (e) => {
    setNoiseLevel(e.target.value);
    socket.emit("setNoiseLevel", e.target.value);
    toast.success(`Noise level adjusted to ${e.target.value}`);
  };

  const valueText = (value) => {
    return value;
  };

  const weatherCodes = {
    0: "sunny",
    1: "day",
    2: "day",
    3: "day",
    51: "rain",
    53: "rain",
    55: "rain",
    61: "rain",
    63: "rain",
    65: "rain",
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendHouseInvite = async (email) => {
    try {
      const JSONPayload = JSON.stringify({
        houseId: houseInfo._id,
        email,
      });
      const response = await fetch(
        "https://cohab-4fcf8ee594c1.herokuapp.com/api/houses/sendJoinCode",
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
        if (data.sent) {
          toast.success("House Invite Code Sent");
        } else {
          toast.error("Not sent", { description: data.error });
        }
      } else {
        throw new Error(response.status);
        toast.error(response.status);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmitInvite = (e) => {
    e.preventDefault();

    if (houseInfo) {
      sendHouseInvite(email);
      setEmail("");
      setAddRoommate(false);
    } else {
      toast.error("No House ID");
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen w-full overflow-y-auto overflow-x-auto">
        <div className="w-full h-full flex overflow-y-auto flex-row flex-wrap justify-evenly gap-y-4 lg:gap-0 items-center py-4">
          <div
            className="w-5/6 lg:w-[44.5%] rounded-xl h-[30%] lg:h-[47%] bg-no-repeat bg-cover bg-neutral-800"
            style={{
              backgroundImage: `url(${background ?? null})`,
            }}
          >
            <div className="flex flex-col w-full rounded-xl h-full p-8 justify-between items-start bg-neutral-800 bg-opacity-60">
              <div className=" flex flex-col items-start ">
                <p className="font-bold text-3xl lg:text-4xl">
                  {dayjs().format("dddd")},
                </p>
                <p className=" text-3xl  lg:text-7xl">{dayjs().format("LL")}</p>
              </div>
              {weather ? (
                <div className="flex flex-row w-full justify-between font-bold text-xl lg:text-3xl 2xl:text-4xl ">
                  <div className="flex flex-row items-center gap-x-1">
                    <Thermometer />
                    <p>
                      {weather.current.temperature_2m}
                      {weather.current_units.temperature_2m}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-x-1">
                    <CloudRainWind />
                    <p>
                      {weather.current.precipitation.toFixed(2)}{" "}
                      {weather.current_units.precipitation}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-x-1">
                    <Wind />
                    <p>
                      {weather.current.wind_speed_10m}{" "}
                      {weather.current_units.wind_speed_10m}
                    </p>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-row w-full gap-x-4 items-center ">
                <p className="font-bold text-xl lg:text-2xl">Noise Level:</p>
                <EarOff />
                <Slider
                  aria-label="Small steps"
                  getAriaValueText={valueText}
                  value={noiseLevel}
                  step={1}
                  marks
                  min={0}
                  max={10}
                  onChange={handleSliderChange}
                  color=""
                  valueLabelDisplay="auto"
                />
                <Ear />
              </div>
            </div>
          </div>
          <SmallCalendar events={events} />
          <div className="flex flex-col w-5/6 lg:w-[44.5%] rounded-xl lg:h-[47%] bg-neutral-800 p-8 pb-6 justify-between items-start">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="font-bold text-2xl mb-3">Roommates:</div>
              <button
                onClick={() => setAddRoommate(true)}
                className="flex flex-row mb-3 p-2 bg-eucalyptus-600 hover:bg-eucalyptus-800 border border-neutral-500"
              >
                Invite Roommate
                <PlusSquare className="ml-1" />
              </button>
            </div>
            {addRoommate ? (
              <div className="flex flex-col justify-center bg-eucalyptus-950 w-full h-full rounded-lg border-neutral-700 border-2 p-4">
                <div className="font-bold text-lg mb-4">
                  Invite New Roommate
                </div>
                <form
                  onSubmit={handleSubmitInvite}
                  className="flex flex-col items-center gap-4"
                >
                  <input
                    onChange={handleEmailChange}
                    value={email}
                    placeholder="Enter Email Address"
                    className="w-3/4 h-12 bg-neutral-800 rounded-xl border border-neutral-400 pl-4"
                  ></input>
                  <div className="flex flex-row items-center gap-2">
                    <button
                      type="submit"
                      className="p-2 bg-eucalyptus-700 hover:bg-eucalyptus-600"
                    >
                      Send Invite
                    </button>
                    <button
                      type="buttom"
                      onClick={() => setAddRoommate(false)}
                      className="p-2 bg-red-700 hover:bg-red-600 mt-1"
                    >
                      Cancel{" "}
                    </button>
                  </div>
                </form>
              </div>
            ) : roommateLoading ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                {" "}
                <RingLoader color="#36d7b7" size={96} />{" "}
              </div>
            ) : (
              <EmblaCarousel userInfo={userInfo} houseMates={houseMates} />
            )}
          </div>
          <div className="flex flex-row w-5/6 lg:w-[50%] h-[47%] justify-between">
            <div className="flex flex-col w-[47%] rounded-xl h-full bg-neutral-800 p-8 pb-4 justify-between items-start">
              <div className="font-bold text-2xl pb-4">Recent Messages:</div>
              <div className="flex flex-col  w-full h-full gap-y-2 justify-start overflow-y-auto">
                {messages
                  ? messages
                      .toReversed()
                      .slice(0, 3)
                      .map(({ message, sentBy, date }, i) => {
                        return (
                          <div
                            key={i}
                            className="flex flex-col w-full h-20 bg-eucalyptus-700 rounded items-start px-3 py-1 justify-evenly"
                          >
                            <p className="w-full text-left font-bold text-sm 2xl:text-base text-ellipsis text-nowrap overflow-hidden">
                              {message}
                            </p>
                            <p className="w-full text-left text-xs text-ellipsis text-nowrap overflow-hidden">
                              Sent By:{" "}
                              <span className="font-bold">{sentBy}</span>
                            </p>
                            <p className="w-full text-left text-xs text-ellipsis text-nowrap overflow-hidden">
                              Date:{" "}
                              <span className="font-bold">
                                {dayjs(date).format("lll")}
                              </span>
                            </p>
                          </div>
                        );
                      })
                  : null}
              </div>
            </div>
            <div className="flex flex-col w-[47%] rounded-xl h-full bg-neutral-800 p-8 pb-4 justify-between items-start">
              <div className="font-bold text-2xl mb-4">Recent Tasks:</div>
              <div className="flex flex-col w-full h-full gap-y-2 justify-start overflow-y-auto">
                {tasks
                  ? tasks
                      .toReversed()
                      .slice(0, 3)
                      .map((task, i) => {
                        return !task.completed ? (
                          <div
                            key={i}
                            className="flex flex-col w-full bg-eucalyptus-700 rounded items-start pl-3 pt-1"
                          >
                            <p className="w-full text-left font-bold text-base lg:text-xl">
                              {task.task}
                            </p>
                            <p className="w-full text-left text-sm">
                              Created By:{" "}
                              <span className="font-bold">
                                {task.createdBy}
                              </span>
                            </p>
                            <p className="w-full text-left text-sm">
                              Assigned to:{" "}
                              <span className="font-bold">
                                {task.assignedTo}
                              </span>
                            </p>
                          </div>
                        ) : null;
                      })
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
