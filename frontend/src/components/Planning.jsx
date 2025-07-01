import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { FaCompress, FaExpand } from "react-icons/fa";
import { Button, Modal } from "flowbite-react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Dashboard/Calendar.css";

import CustomToolbar from "./CustomToolbar";
import EventModal from "./Dashboard/Modals/EventModal";
import useUser from "@/hooks/useUser";
import useNotification from "@/hooks/useNotification";
import { validateResponse } from "@/utils/helpers";
import {
  getEventTypeColor,
  CALENDAR_CONFIG,
  PRIORITY_STYLES,
} from "@/utils/constants";

moment.locale("fr");
const localizer = momentLocalizer(moment);

const Planning = ({ title, initialEvents }) => {
  const { userId } = useUser();
  const { success } = useNotification();
  const calendarRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const baseUrl = useMemo(() => import.meta.env.VITE_API_URL || "", []);

  const eventType = useMemo(() => {
    if (title.includes("personnel")) return 1;
    if (title.includes("scolaire")) return 2;
    if (title.includes("professionnel")) return 3;
    return 1;
  }, [title]);

  const isAllPlannings = useMemo(() => title.includes("Tous"), [title]);

  const eventStyleGetter = useCallback((event) => {
    const backgroundColor = getEventTypeColor(event.type);
    const priorityBorderWidth = { 1: "1px", 2: "2px", 3: "3px" };

    return {
      style: {
        backgroundColor,
        color: "#fff",
        borderRadius: "4px",
        borderWidth: priorityBorderWidth[event.priority] || "1px",
      },
    };
  }, []);

  useEffect(() => {
    const formattedEvents = initialEvents?.length
      ? initialEvents.map((event) => ({
          ...event,
          start: new Date(event.startdate),
          end: new Date(event.enddate),
        }))
      : [];
    setEvents(formattedEvents);
  }, [initialEvents]);

  const getDateRange = useCallback((date, view) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    switch (view) {
      case "month":
        return {
          rangeStart: new Date(year, month, 1),
          rangeEnd: new Date(year, month + 1, 0),
        };
      case "week":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return { rangeStart: weekStart, rangeEnd: weekEnd };
      case "day":
        return { rangeStart: date, rangeEnd: date };
      default:
        return {
          rangeStart: new Date(year, month, 1),
          rangeEnd: new Date(year, month + 1, 0),
        };
    }
  }, []);

  const fetchEvents = useCallback(
    async (start, end, viewType) => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const startMonth = start.getMonth() + 1;
        const endMonth = end.getMonth() + 1;
        const months =
          startMonth === endMonth || viewType !== "month"
            ? [startMonth]
            : [startMonth, endMonth];

        const typesToFetch = isAllPlannings ? [1, 2, 3] : [eventType];

        const fetchEventsByTypeAndMonth = async (type, month) => {
          try {
            const response = await axios.get(
              `${baseUrl}/api/events/${userId}/month/${month}?type=${type}`,
              { timeout: 10000, headers: { Accept: "application/json" } }
            );
            return validateResponse(response) || [];
          } catch (error) {
            console.error(
              `Error fetching events for type ${type}, month ${month}:`,
              error
            );
            return [];
          }
        };

        const promises = months.flatMap((month) =>
          typesToFetch.map((type) => fetchEventsByTypeAndMonth(type, month))
        );

        const results = await Promise.all(promises);
        const fetchedEvents = results.flat();

        const formattedEvents = fetchedEvents
          .map((event) => ({
            ...event,
            start: new Date(event.startdate),
            end: new Date(event.enddate),
          }))
          .sort((a, b) => a.start - b.start);

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, baseUrl, eventType, isAllPlannings]
  );

  useEffect(() => {
    if (!userId || isAllPlannings) return;

    const { rangeStart, rangeEnd } = getDateRange(currentDate, currentView);
    fetchEvents(rangeStart, rangeEnd, currentView);
  }, [
    userId,
    currentDate,
    currentView,
    refreshTrigger,
    fetchEvents,
    getDateRange,
    isAllPlannings,
  ]);

  const apiRequest = useCallback(async (url, method, data = null) => {
    const config = {
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return method === "delete" && data
      ? axios.delete(url, { ...config, data })
      : axios[method](url, data, config);
  }, []);

  const refreshEvents = useCallback(() => {
    if (!isAllPlannings) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [isAllPlannings]);

  const addEventToCalendar = useCallback(
    (newEvent) => {
      if (isAllPlannings || newEvent.type === eventType) {
        const formattedEvent = {
          ...newEvent,
          start: new Date(newEvent.startdate),
          end: new Date(newEvent.enddate),
        };
        setEvents((prevEvents) => [...prevEvents, formattedEvent]);
      }
    },
    [isAllPlannings, eventType]
  );

  const updateEventInCalendar = useCallback(
    (updatedEvent) => {
      const formattedEvent = {
        ...updatedEvent,
        start: new Date(updatedEvent.startdate),
        end: new Date(updatedEvent.enddate),
      };

      setEvents((prevEvents) => {
        const eventExists = prevEvents.some(
          (event) => event.ID === updatedEvent.ID
        );
        if (eventExists) {
          return prevEvents.map((event) =>
            event.ID === updatedEvent.ID ? formattedEvent : event
          );
        }
        // Ajouter si l'événement doit être affiché dans cette vue
        return isAllPlannings || updatedEvent.type === eventType
          ? [...prevEvents, formattedEvent]
          : prevEvents;
      });
    },
    [isAllPlannings, eventType]
  );

  const removeEventFromCalendar = useCallback((eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.ID !== eventId)
    );
  }, []);

  const handleCreateEvent = useCallback(
    async (eventData) => {
      if (!userId) return;

      try {
        const response = await apiRequest(
          `${baseUrl}/api/events/create`,
          "post",
          {
            userId,
            title: eventData.title,
            startdate: eventData.start.toISOString(),
            enddate: eventData.end.toISOString(),
            description: eventData.description || "",
            type: eventData.type || eventType,
            priority: eventData.priority || 1,
            place: eventData.place || "",
          }
        );

        const newEvent = {
          ID: response.data?.ID || response.data?.id || Date.now(),
          title: eventData.title,
          startdate: eventData.start.toISOString(),
          enddate: eventData.end.toISOString(),
          description: eventData.description || "",
          type: eventData.type || eventType,
          priority: eventData.priority || 1,
          place: eventData.place || "",
        };

        success("Événement créé !");
        setShowEventModal(false);
        addEventToCalendar(newEvent);
        refreshEvents();
      } catch (error) {
        console.error("Error creating event:", error);
      }
    },
    [
      userId,
      baseUrl,
      eventType,
      apiRequest,
      addEventToCalendar,
      refreshEvents,
      success,
    ]
  );

  const handleUpdateEvent = useCallback(
    async (eventData) => {
      if (!userId || !selectedEvent?.ID) return;

      try {
        await apiRequest(
          `${baseUrl}/api/events/update/${selectedEvent.ID}`,
          "put",
          {
            userId,
            title: eventData.title,
            startdate: eventData.start.toISOString(),
            enddate: eventData.end.toISOString(),
            description: eventData.description || "",
            type: eventData.type || selectedEvent.type,
            priority: eventData.priority || selectedEvent.priority,
            place: eventData.place || selectedEvent.place,
          }
        );

        const updatedEvent = {
          ...selectedEvent,
          title: eventData.title,
          startdate: eventData.start.toISOString(),
          enddate: eventData.end.toISOString(),
          description: eventData.description || "",
          type: eventData.type || selectedEvent.type,
          priority: eventData.priority || selectedEvent.priority,
          place: eventData.place || selectedEvent.place,
        };

        success("Événement mis à jour !");
        setShowEditModal(false);
        updateEventInCalendar(updatedEvent);
        refreshEvents();
      } catch (error) {
        console.error("Error updating event:", error);
      }
    },
    [
      userId,
      baseUrl,
      selectedEvent,
      apiRequest,
      updateEventInCalendar,
      refreshEvents,
      success,
    ]
  );

  const handleDeleteEvent = useCallback(async () => {
    if (!userId || !selectedEvent?.ID) return;

    try {
      await apiRequest(
        `${baseUrl}/api/events/delete/${selectedEvent.ID}`,
        "delete",
        { userId }
      );

      success("Événement supprimé !");
      setShowEditModal(false);
      removeEventFromCalendar(selectedEvent.ID);
      refreshEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }, [
    userId,
    baseUrl,
    selectedEvent,
    apiRequest,
    removeEventFromCalendar,
    refreshEvents,
    success,
  ]);

  const handleNavigate = useCallback((newDate) => setCurrentDate(newDate), []);
  const handleViewChange = useCallback((view) => setCurrentView(view), []);
  const toggleFullscreen = useCallback(
    () => setIsFullscreen((prev) => !prev),
    []
  );

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      setSelectedEvent({
        title: "",
        start,
        end,
        description: "",
        type: eventType,
        priority: 1,
        place: "",
      });
      setShowEventModal(true);
    },
    [eventType]
  );

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  }, []);

  const calendarProps = useMemo(
    () => ({
      localizer,
      culture: "fr",
      events,
      startAccessor: "start",
      endAccessor: "end",
      selectable: true,
      onSelectSlot: handleSelectSlot,
      onSelectEvent: handleSelectEvent,
      defaultView: "week",
      view: currentView,
      date: currentDate,
      onNavigate: handleNavigate,
      onView: handleViewChange,
      views: ["month", "week", "day", "agenda"],
      className: "bg-white rounded-lg shadow-sm no-border",
      components: {
        toolbar: (props) => (
          <CustomToolbar
            {...props}
            onNavigate={props.onNavigate}
            onView={props.onView}
            view={props.view}
          />
        ),
      },
      messages: CALENDAR_CONFIG.messages,
      formats: CALENDAR_CONFIG.formats,
      eventPropGetter: eventStyleGetter,
      ref: calendarRef,
    }),
    [
      events,
      currentView,
      currentDate,
      handleNavigate,
      handleViewChange,
      handleSelectSlot,
      handleSelectEvent,
      eventStyleGetter,
    ]
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="calendar-container relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        )}
        <Calendar {...calendarProps} style={{ height: "31.25rem" }} />
      </div>

      <div className="flex justify-end mt-3">
        <Button
          onClick={toggleFullscreen}
          className="w-10 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors"
          aria-label={isFullscreen ? "Réduire" : "Agrandir"}
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </Button>
      </div>

      {isFullscreen && (
        <Modal show onClose={toggleFullscreen} size="full" position="center">
          <Modal.Header>{title}</Modal.Header>
          <Modal.Body>
            <Calendar {...calendarProps} style={{ height: "100vh" }} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={toggleFullscreen}
              className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors"
              aria-label="Réduire"
            >
              <FaCompress />
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <EventModal
        show={showEventModal}
        onHide={() => setShowEventModal(false)}
        event={selectedEvent}
        isEdit={false}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        planningTitle={title}
      />

      <EventModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        event={selectedEvent}
        isEdit={true}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        planningTitle={title}
      />
    </div>
  );
};

export default Planning;
