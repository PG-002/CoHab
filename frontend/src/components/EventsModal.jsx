import React, { useEffect, useState } from "react";
import {
  GripHorizontal,
  Clock,
  X,
  Trash,
  AlignRight,
  Minus,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import dayjs from "dayjs";

export default function EventModal({
  newEventInfo,
  cancelModal,
  showModal,
  setShowEventModal,
  selectedEvent,
  dispatchEvent,
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allDay, setAllDay] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title ? selectedEvent.title : "");
      setDescription(
        selectedEvent.description ? selectedEvent.description : ""
      );
      setStartDate(selectedEvent.start);
      setEndDate(selectedEvent.end);
      setAllDay(selectedEvent.allDay);
      setDescription(selectedEvent.extendedProps.description);
    } else if (newEventInfo) {
      setStartDate(newEventInfo.start);
      setEndDate(newEventInfo.end);
      setAllDay(newEventInfo.allDay);
      setTitle("");
      setDescription("");
    }
  }, [selectedEvent, newEventInfo]);

  function handleSubmit(e) {
    e.preventDefault();
    const calendarEvent = {
      title: title ? title : "Untitled Event",
      description: description,
      start: startDate,
      end: endDate,
      allDay: allDay,
    };

    if (selectedEvent) {
      dispatchEvent({
        type: "update",
        calendarEvent: calendarEvent,
        originalEvent: selectedEvent,
      });
    } else {
      dispatchEvent({
        type: "push",
        calendarEvent: calendarEvent,
        originalEvent: null,
      });
    }

    setShowEventModal(false);
  }
  return (
    <>
      <Modal
        overlayClassName={"overlay"}
        isOpen={showModal}
        className="z-[999] bg-black bg-opacity-55 h-screen w-full fixed left-0 top-0 flex justify-center items-center"
      >
        <form onClick={() => {}} className="bg-white rounded-lg shadow-2xl ">
          <header className=" bg-gray-100 px-4 py-2 flex justify-between items-center">
            <GripHorizontal className=" text-gray-400"></GripHorizontal>
            <div className="flex flex-row gap-4">
              <button
                type="button"
                className="bg-transparent border-none hover:border-none "
                onClick={cancelModal}
              >
                <X className="text-gray-400 cursor-pointer hover:text-red-600"></X>
              </button>
            </div>
          </header>
          <div className="p-3">
            <div className="grid grid-cols-1/5 items-end gap-y-7">
              <div></div>
              <input
                type="text"
                name="title"
                placeholder="Add title"
                value={title}
                required
                className="bg-white border-0 text-xl font-semibold p-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex flex-row text-black">
                <Clock className="mr-3 text-gray-400"></Clock>
                <div className="flex md:flex-row flex-col items-center">
                  <DatePicker
                    className="bg-white text-sm text-center font-bold p-1 hover:cursor-pointer hover:bg-gray-200 rounded-lg border-gray-300 border-2"
                    showTimeSelect={!allDay}
                    selected={startDate}
                    dateFormat={!allDay ? "MM/dd/yyyy hh:mm a" : "MM/dd/yyyy"}
                    onChange={(date) => {
                      setStartDate(date);
                      setEndDate(date);
                    }}
                  />
                  <Minus className="mx-2"></Minus>
                  <DatePicker
                    className="bg-white text-sm font-bold text-center p-1 hover:cursor-pointer hover:bg-gray-200 rounded-lg border-gray-300 border-2"
                    showTimeSelect={!allDay}
                    selected={
                      endDate
                        ? dayjs(endDate).subtract(1, "day").toDate()
                        : startDate
                    }
                    dateFormat={!allDay ? "MM/dd/yyyy hh:mm a" : "MM/dd/yyyy"}
                    onChange={(date) => {
                      if (date >= startDate) {
                        setEndDate(date);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-row pl-10 bg-white">
                <input
                  type="checkbox"
                  className="appearance-none peer size-6 rounded-lg bg-white border-2 border-gray-400 shrink-0 checked:bg-blue-800 checked:border-0 cursor-pointer"
                  defaultChecked={allDay}
                  onChange={() => {
                    setAllDay((prevState) => !prevState);
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="absolute size-6 hidden peer-checked:block text-white font-extrabold pointer-events-none"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>

                <p className="text-black ml-2">All Day?</p>
              </div>

              <div className="flex flex-row">
                <AlignRight className="mr-3 text-gray-400"></AlignRight>
                <textarea
                  type="text"
                  name="description"
                  placeholder="Add a description"
                  value={description}
                  required
                  className="bg-white text-xs md:text-base  border-0 text-gray-600 p-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
          <footer className="flex flex-row justify-between items-center border-t p-3 pl-5 mt-5">
            <div>
              {selectedEvent && (
                <Trash
                  onClick={() => {
                    dispatchEvent({
                      type: "delete",
                      originalEvent: selectedEvent,
                      calendarEvent: null,
                    });
                    setShowEventModal(false);
                  }}
                  className=" hover:text-red-600 text-gray-400 cursor-pointer"
                ></Trash>
              )}
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
            >
              Save
            </button>
          </footer>
        </form>
      </Modal>
    </>
  );
}
