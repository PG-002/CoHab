import { Link, useNavigate } from "react-router-dom";
import SmallCalendar from "../components/Dashboard/SmallCalendar";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Slider from "@mui/material/Slider";
import { Thermometer, CloudRainWind, Wind, EarOff, Ear } from "lucide-react";

dayjs.extend(localizedFormat);

const DashboardPage = ({ houseInfo, socket, setHouseInfo }) => {
  const [date, setDate] = useState(dayjs());
  const [events, setEvents] = useState(null);
  const [weather, setWeather] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(null);
  const [houseUpdate, setHouseUpdate] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto",
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

    fetchWeather();
  }, []);

  useEffect(() => {
    if (houseInfo) {
      setEvents(houseInfo.events);
      setNoiseLevel(houseInfo.noiseLevel);
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
      fetchHouseInfo();
    }
  }, [houseUpdate]);

  const handleSliderChange = (e) => {
    setNoiseLevel(e.target.value);
    socket.emit("setNoiseLevel", e.target.value);
  };

  const valueText = (value) => {
    return value;
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto p-5">
      <div className="w-full flex flex-row flex-wrap justify-evenly gap-x-4 h-full">
        <div className="flex flex-col w-[40rem] rounded-xl h-[21rem] bg-neutral-800 p-10 justify-between items-start">
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
              valueLabelDisplay="auto"
            />
            <Ear />
          </div>
        </div>
        <SmallCalendar events={events} />
      </div>
    </div>
  );
};

export default DashboardPage;
