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

const Calendar = ({ events, updateEvents }) => {
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
      originalEvent.setDates(calendarEvent.start, calendarEvent.end);
      originalEvent.setAllDay(calendarEvent.allDay);
      originalEvent.setProp("title", calendarEvent.title);
      originalEvent.setExtendedProp("description", calendarEvent.description);
    } else if (type === "push") {
      const { title, description, start, end, allDay } = calendarEvent;
      const calendarApi = calendarRef.current.getApi();
      calendarApi.addEvent({
        title,
        start,
        end,
        allDay,
        description,
      });
    } else if (type === "delete") {
      originalEvent.remove();
    }
  };

  const handleCancel = () => {
    setShowEventModal(false);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white text-black w-full p-10 overflow-hidden"
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
        eventsSet={(events) => updateEvents(events)}
        initialEvents={events}
      />
    </div>
  );
};

export default Calendar;
