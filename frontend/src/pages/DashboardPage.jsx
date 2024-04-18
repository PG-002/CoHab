import { Link, useNavigate } from "react-router-dom";
import SmallCalendar from "../components/Dashboard/SmallCalendar";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Slider from "@mui/material/Slider";
import { Thermometer, CloudRainWind, Wind, EarOff, Ear } from "lucide-react";
// import EmblaCarousel from "../components/Dashboard/EmblaCarousel";
import { jwtDecode } from "jwt-decode";
import sunny from "../assets/sunny.jpg";
import day from "../assets/day.jpg";
import rain from "../assets/rain.jpg";
import night from "../assets/night.jpg";

dayjs.extend(localizedFormat);

// const OPTIONS = { slidesToScroll: "auto" };
// const SLIDE_COUNT = 5;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const DashboardPage = ({ userInfo, houseInfo, socket, setHouseInfo }) => {
  const [date, setDate] = useState(dayjs());
  const [events, setEvents] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [messages, setMessages] = useState(null);
  const [weather, setWeather] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(null);
  const [houseUpdate, setHouseUpdate] = useState(false);
  const [background, setBackground] = useState(null);

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
        console.log(data);
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
      console.log("fetched");
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
    if (weather) {
      const condition = weatherCodes[weather.current.weather_code];
      if (condition == "sunny") {
        setBackground(sunny);
      } else if (condition == "day") {
        setBackground(day);
      } else if (condition == "rain") {
        setBackground(rain);
      }
    }
  }, [weather]);

  const handleSliderChange = (e) => {
    setNoiseLevel(e.target.value);
    socket.emit("setNoiseLevel", e.target.value);
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

  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto p-5">
      <div className="w-full flex flex-row flex-wrap justify-center gap-x-10 gap-y-4 items-center h-full">
        <div
          className=" w-[40rem] rounded-xl h-[21rem] bg-no-repeat bg-cover bg-neutral-800"
          style={{
            backgroundImage: `url(${background ?? null})`,
          }}
        >
          <div className="flex flex-col w-[40rem] rounded-xl h-[21rem] p-8 justify-between items-start bg-neutral-800 bg-opacity-60">
            <div className=" flex flex-col items-start ">
              <p className="font-bold text-3xl ">{dayjs().format("dddd")},</p>
              <p className="text-6xl">{dayjs().format("LL")}</p>
            </div>
            {weather ? (
              <div className="flex flex-row w-full justify-between font-bold text-3xl ">
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
              <p className="font-bold text-2xl">Noise Level:</p>
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
        <div className="flex flex-col w-[40rem] rounded-xl h-[22rem] bg-neutral-800 p-8 justify-between items-start">
          <div className="font-bold text-2xl mb-3">Roommates:</div>
          {/* <EmblaCarousel slides={SLIDES} options={OPTIONS} /> */}
        </div>
        <div className="flex flex-col w-[20rem] rounded-xl h-[22rem] bg-neutral-800 p-8 pb-4 justify-between items-start">
          <div className="font-bold text-2xl pb-4">Recent Messages:</div>
          <div className="flex flex-col flex-wrap w-full h-full gap-y-2 justify-start overflow-y-auto">
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
                        <p className="w-full text-left font-bold text-sm text-ellipsis text-nowrap overflow-hidden">
                          {message}
                        </p>
                        <p className="w-full text-left text-xs text-ellipsis text-nowrap overflow-hidden">
                          Sent By: <span className="font-bold">{sentBy}</span>
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
        <div className="flex flex-col w-[17.5rem] rounded-xl h-[22rem] bg-neutral-800 p-8 pb-4 justify-between items-start">
          <div className="font-bold text-2xl mb-4">Recent Tasks:</div>
          <div className="flex flex-col flex-wrap w-full h-full gap-y-2 justify-start overflow-y-auto">
            {tasks
              ? tasks
                  .toReversed()
                  .slice(0, 3)
                  .map((task, i) => {
                    return !task.completed ? (
                      <div
                        key={i}
                        className="flex flex-col w-full h-20 bg-eucalyptus-700 rounded items-start pl-3 pt-1"
                      >
                        <p className="w-full text-left font-bold text-xl">
                          {task.task}
                        </p>
                        <p className="w-full text-left text-sm">
                          Created By:{" "}
                          <span className="font-bold">{task.createdBy}</span>
                        </p>
                        <p className="w-full text-left text-sm">
                          Assigned to:{" "}
                          <span className="font-bold">{task.assignedTo}</span>
                        </p>
                      </div>
                    ) : null;
                  })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
