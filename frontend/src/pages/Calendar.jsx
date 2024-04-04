import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import EventModal from "../components/EventsModal";
// import Header from "../../components/Header";
// import { tokens } from "../../theme";

const Calendar = ({ deleteEvent, updateEvent, events, addEvent }) => {
  const calendarRef = useRef();
  const containerRef = useRef();
  const [showModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [newEventInfo, setNewEventInfo] = useState();

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }
    if (calendarRef.current === null) {
      return;
    }

    const calendarApi = calendarRef.current.getApi();

    const resizeObserver = new ResizeObserver(() => calendarApi.updateSize());
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [calendarRef, containerRef]);

  const handleDateClick = (selected) => {
    setNewEventInfo(selected);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (selected) => {
    setSelectedEvent(selected.event);
    setNewEventInfo(null);
    setShowEventModal(true);
  };

  const handleSubmitEvent = ({ type, calendarEvent, originalEvent }) => {
    if (type === "update") {
      const newEvent = {
        _id: originalEvent.extendedProps._id,
        title: calendarEvent.title,
        start: calendarEvent.start,
        end: calendarEvent.end,
        allDay: calendarEvent.allDay,
        description: calendarEvent.description,
      };

      updateEvent(newEvent);
    } else if (type === "push") {
      const { title, description, start, end, allDay } = calendarEvent;
      const newEvent = {
        title,
        start,
        end,
        allDay,
        description,
      };
      addEvent(newEvent);
    } else if (type === "delete") {
      const newEvent = {
        _id: originalEvent.extendedProps._id,
        title: originalEvent.title,
        start: originalEvent.start,
        end: originalEvent.end,
        allDay: originalEvent.allDay,
        description: originalEvent.description,
      };
      originalEvent.remove();
      deleteEvent(newEvent);
    }
  };

  const handleCancel = () => {
    setShowEventModal(false);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white text-black font-bold w-full p-10 overflow-hidden"
    >
      <EventModal
        cancelModal={handleCancel}
        newEventInfo={newEventInfo}
        showModal={showModal}
        setShowEventModal={setShowEventModal}
        selectedEvent={selectedEvent}
        dispatchEvent={handleSubmitEvent}
      ></EventModal>
      <FullCalendar
        ref={calendarRef}
        height={"100%"}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        select={handleDateClick}
        eventClick={handleEventClick}
        eventAdd={addEvent}
        events={events}
      />
    </div>
  );
};

export default Calendar;
