import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "../../components/CustomToolbar";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCompress, FaExpand } from "react-icons/fa";
import "../../components/Dashboard/Calendar.css";

moment.locale("fr");
const localizer = momentLocalizer(moment);

const messages = {
  allDay: "Toute la journée",
  previous: "Précédent",
  next: "Suivant",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
  noEventsInRange: "Aucun événement dans cette période.",
  showMore: (total) => `+ ${total} plus`,
};

const formats = {
  timeGutterFormat: (date, culture, localizer) =>
    localizer.format(date, "HH:mm", culture),
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
      end,
      "HH:mm",
      culture
    )}`,
  agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
      end,
      "HH:mm",
      culture
    )}`,
};

const PlanningPro = () => {
  const [events, setEvents] = useState([
    {
      title: "Réunion projet",
      start: new Date(),
      end: new Date(moment().add(2, "hours").toDate()),
    },
    {
      title: "Formation",
      start: new Date(moment().add(2, "days").toDate()),
      end: new Date(moment().add(3, "days").toDate()),
    },
  ]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const calendarRef = useRef(null);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("New Event Name");
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  const handleSelectEvent = (event) => {
    alert(event.title);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          defaultView="week"
          views={["month", "week", "day", "agenda"]}
          style={{ height: "31.25rem" }}
          className="bg-white rounded-lg shadow-sm no-border"
          components={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                onNavigate={props.onNavigate}
                onView={props.onView}
                view={props.view}
              />
            ),
          }}
          messages={messages}
          formats={formats}
          ref={calendarRef}
        />
      </div>
      <div className="flex justify-end mt-3">
        <Button
          variant="primary"
          onClick={toggleFullscreen}
          className="w-10 h-9 flex items-center justify-center"
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </Button>
      </div>
      <Modal
        show={isFullscreen}
        onHide={toggleFullscreen}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Fullscreen Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              defaultView="week"
              views={["month", "week", "day", "agenda"]}
              style={{ height: "100vh" }}
              className="bg-white rounded-lg shadow-sm no-border"
              components={{
                toolbar: (props) => (
                  <CustomToolbar
                    {...props}
                    onNavigate={props.onNavigate}
                    onView={props.onView}
                    view={props.view}
                  />
                ),
              }}
              messages={messages}
              formats={formats}
              ref={calendarRef}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center"
          >
            <FaCompress />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlanningPro;