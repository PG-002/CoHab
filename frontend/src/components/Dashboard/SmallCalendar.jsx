import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ChevronFirst, ChevronLast } from "lucide-react";
import "dayjs/plugin/localizedFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router-dom";

dayjs.extend(localizedFormat);

function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

const SmallCalendar = ({ events }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [smallCalendarMonth, setSmallCalendarMonth] =
    useState(currentMonthIndex);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [eventsList, setEventsList] = useState(null);

  useEffect(() => {
    if (events) {
      const tempList = [];
      const dayjsList = [];

      events.map((eventObj) => {
        if (
          dayjs(eventObj.start).month() ==
          dayjs(new Date(dayjs().year(), currentMonthIndex)).month()
        ) {
          tempList.push(eventObj);
          dayjsList.push(dayjs(eventObj.start).format("YYYYMMDD"));
        }
      });

      setEventsList(tempList);
    }
  }, [events, currentMonthIndex]);

  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIndex));
  }, [currentMonthIndex]);

  const handlePrevMonth = () => {
    setCurrentMonthIndex(currentMonthIndex - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(currentMonthIndex + 1);
  };

  const checkEventOnDay = (day, event) => {
    if (event) {
      return day.format("YYYYMMDD") === dayjs(event.start).format("YYYYMMDD");
    } else {
      if (eventsList) {
        let flag = 0;
        eventsList.map((event) => {
          if (
            day.format("YYYYMMDD") === dayjs(event.start).format("YYYYMMDD")
          ) {
            flag += 1;
          }
        });
        if (flag > 0) {
          return true;
        }
      }
      return false;
    }
  };

  const getDayClass = (day) => {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      return "bg-eucalyptus-600 rounded-full text-white";
    } else if (currDay === slcDay) {
      return "bg-eucalyptus-500 rounded-full text-eucalyptus-100 font-bold";
    } else {
      if (
        day.month() !=
        dayjs(new Date(dayjs().year(), currentMonthIndex)).month()
      ) {
        return "bg-transparent border-none rounded-full hover:bg-neutral-700 text-neutral-600";
      }
      return "bg-transparent border-none rounded-full hover:bg-neutral-700";
    }
  };

  return (
    <div className="flex flex-row gap-12 text-left overflow-hidden text-white">
      <div className="px-3 pb-2 pt-1 w-[20rem] lg:w-[25rem] rounded-xl h-[21rem] lg:h-[26.25rem] bg-neutral-800">
        <header className="flex justify-between items-center pl-3">
          <Link to="/calendar">
            <p className="text-white font-bold">
              {dayjs(new Date(dayjs().year(), currentMonthIndex)).format(
                "MMMM YYYY"
              )}
            </p>
          </Link>
          <div>
            <button
              className="mx-2 bg-transparent hover:bg-eucalyptus-900 hover:bg-opacity-40 rounded-full p-1 mt-1 border-none focus:outline-none"
              onClick={handlePrevMonth}
            >
              <ChevronFirst className="cursor-pointer text-white"></ChevronFirst>
            </button>
            <button
              className="mx-2 bg-transparent rounded-full hover:bg-eucalyptus-900 hover:bg-opacity-40 p-1 mt-1 border-none focus:outline-none"
              onClick={handleNextMonth}
            >
              <ChevronLast className="cursor-pointer text-white"></ChevronLast>
            </button>
          </div>
        </header>
        <div className="h-[18rem] lg:h-[22.5rem] grid grid-cols-7 grid-rows-6 gap-1">
          {currentMonth[0].map((day, i) => (
            <span
              key={i}
              className="text-sm lg:text-lg pt-2 text-center text-neutral-300 font-bold"
            >
              {day.format("dd").charAt(0)}
            </span>
          ))}
          {currentMonth.map((row, i) => (
            <React.Fragment key={i}>
              {row.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSmallCalendarMonth(currentMonthIndex);
                    setDaySelected(day);
                  }}
                  className={`flex flex-col items-center w-full focus:outline-none focus:border-none focus: ${getDayClass(
                    day
                  )} `}
                >
                  <span className="text-sm lg:text-lg">{day.format("D")}</span>
                  {checkEventOnDay(day) ? (
                    <div className="bg-eucalyptus-300 size-1 lg:size-[.375rem] rounded-full m-0 p-0"></div>
                  ) : null}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center w-[20rem] lg:w-[25rem] h-[21rem] lg:h-[26.25rem] p-1 bg-neutral-800 rounded-xl">
        <p className="p-1 font-bold">
          {daySelected ? daySelected.format("MM/DD/YY") + " Events" : null}:
        </p>
        <div className="flex flex-col items-center overflow-y-auto w-full m-2 px-2 gap-2 rounded-xl">
          {eventsList
            ? eventsList.map((event, i) => {
                if (event) {
                  return checkEventOnDay(daySelected ?? dayjs(), event) ? (
                    <div
                      key={i}
                      className="flex flex-col w-full h-12 lg:h-16 rounded shadow-lg bg-eucalyptus-700 p-1 pl-2"
                    >
                      <p className="text-sm lg:text-lg font-bold text-ellipsis text-nowrap overflow-hidden">
                        {event.title}
                      </p>
                      <p className="text-xs lg:text-sm">
                        {event.allDay
                          ? "All-Day"
                          : `${dayjs(event.start).format("LT")} -
                              ${dayjs(event.end).format("LT")}`}
                      </p>
                    </div>
                  ) : null;
                }
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default SmallCalendar;
