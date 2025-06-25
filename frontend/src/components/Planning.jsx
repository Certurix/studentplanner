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

// Custom styles
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Dashboard/Calendar.css";

import { Button, Modal } from "flowbite-react";
import CustomToolbar from "./CustomToolbar";
import EventModal from "./Dashboard/Events/EventModal";
import { validateResponse } from "@/utils/helpers";

// Hooks
import useUser from "@/hooks/useUser";
import { getEventTypeColor } from "@/utils/constants";

// Set up localizer for calendar
moment.locale("fr");
const localizer = momentLocalizer(moment);

// Constants for calendar configuration
const CALENDAR_MESSAGES = {
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

const CALENDAR_FORMATS = {
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

const EVENT_TYPES = {
  PERSONAL: 1,
  ACADEMIC: 2,
  PROFESSIONAL: 3,
};

const TYPE_COLORS = {
  [EVENT_TYPES.PERSONAL]: getEventTypeColor(EVENT_TYPES.PERSONAL) || "#3b82f6",
  [EVENT_TYPES.ACADEMIC]: getEventTypeColor(EVENT_TYPES.ACADEMIC) || "#10b981",
  [EVENT_TYPES.PROFESSIONAL]:
    getEventTypeColor(EVENT_TYPES.PROFESSIONAL) || "#f59e0b",
  default: getEventTypeColor() || "#6b7280",
};

const PRIORITY_BORDER_WIDTH = {
  1: "1px", // Low
  2: "2px", // Medium
  3: "3px", // High
};

const Planning = ({ title, initialEvents }) => {
  const { userId } = useUser();
  const calendarRef = useRef(null);

  // States
  const [events, setEvents] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoized functions and values
  const eventType = useMemo(() => {
    if (title.includes("personnel")) return EVENT_TYPES.PERSONAL;
    if (title.includes("scolaire")) return EVENT_TYPES.ACADEMIC;
    if (title.includes("professionnel")) return EVENT_TYPES.PROFESSIONAL;
    return EVENT_TYPES.PERSONAL; // Default
  }, [title]);

  const isAllPlannings = useMemo(() => title.includes("Tous"), [title]);

  // Event style generator based on event type and priority
  const eventStyleGetter = useCallback((event) => {
    const backgroundColor =
      getEventTypeColor(event.type) || TYPE_COLORS.default;

    const borderWidth =
      PRIORITY_BORDER_WIDTH[event.priority] || PRIORITY_BORDER_WIDTH[1];

    return {
      style: {
        backgroundColor,
        borderWidth,
        color: "#fff",
        borderRadius: "4px",
      },
    };
  }, []);

  // Format initial events on component mount
  useEffect(() => {
    if (initialEvents && Array.isArray(initialEvents)) {
      const formattedEvents = initialEvents.map((event) => ({
        ...event,
        start: new Date(event.startdate),
        end: new Date(event.enddate),
      }));
      setEvents(formattedEvents);
    } else {
      setEvents([]);
    }
  }, [initialEvents]);

  // Calculate date range based on current view
  const getDateRange = useCallback((date, view) => {
    let rangeStart, rangeEnd;

    switch (view) {
      case "month":
        rangeStart = new Date(date.getFullYear(), date.getMonth(), 1);
        rangeEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        break;
      case "week":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        rangeStart = weekStart;

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        rangeEnd = weekEnd;
        break;
      case "day":
        rangeStart = date;
        rangeEnd = date;
        break;
      default: // Agenda view - default to current month
        rangeStart = new Date(date.getFullYear(), date.getMonth(), 1);
        rangeEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    return { rangeStart, rangeEnd };
  }, []);

  // Get API base URL
  const baseUrl = useMemo(() => import.meta.env.VITE_API_URL || "", []);

  // Fetch events from API
  const fetchEvents = useCallback(
    async (start, end, viewType) => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const startMonth = start.getMonth() + 1;
        const endMonth = end.getMonth() + 1;
        const isSameMonth = startMonth === endMonth || viewType !== "month";
        let fetchedEvents = [];

        // Define a helper function to fetch events
        const fetchEventsByTypeAndMonth = async (type, month) => {
          const apiUrl = `${baseUrl}/api/events/${userId}/month/${month}?type=${type}`;
          try {
            const response = await axios.get(apiUrl, {
              timeout: 10000,
              headers: { Accept: "application/json" },
              validateStatus: (status) => status >= 200 && status < 300,
            });
            return validateResponse(response);
          } catch (error) {
            console.error(
              `Error fetching events for type ${type}, month ${month}:`,
              error
            );
            return [];
          }
        };

        // Determine which events to fetch based on view
        if (isSameMonth) {
          // Single month case
          const typesToFetch = isAllPlannings ? [1, 2, 3] : [eventType];
          const eventPromises = typesToFetch.map((type) =>
            fetchEventsByTypeAndMonth(type, startMonth)
          );

          const results = await Promise.all(eventPromises);
          results.forEach((events) => fetchedEvents.push(...events));
        } else {
          // Multiple month case
          const typesToFetch = isAllPlannings ? [1, 2, 3] : [eventType];
          const eventPromises = [];

          // Add promises for both months
          typesToFetch.forEach((type) => {
            eventPromises.push(fetchEventsByTypeAndMonth(type, startMonth));
            eventPromises.push(fetchEventsByTypeAndMonth(type, endMonth));
          });

          const results = await Promise.all(eventPromises);
          results.forEach((events) => fetchedEvents.push(...events));
        }

        // Ensure fetchedEvents is an array
        if (!Array.isArray(fetchedEvents)) {
          console.error("Fetched events is not an array");
          fetchedEvents = [];
        }

        // Format dates and sort events
        const formattedEvents = fetchedEvents.map((event) => ({
          ...event,
          start: new Date(event.startdate),
          end: new Date(event.enddate),
        }));

        formattedEvents.sort((a, b) => a.start - b.start);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error in fetchEvents function:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, baseUrl, eventType, isAllPlannings]
  );

  // Load events when dependencies change
  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const { rangeStart, rangeEnd } = getDateRange(currentDate, currentView);

        if (isMounted) {
          await fetchEvents(rangeStart, rangeEnd, currentView);
        }
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [
    userId,
    currentDate,
    currentView,
    refreshTrigger,
    fetchEvents,
    getDateRange,
  ]);

  // Helper for adjusting date with timezone offset
  const adjustDateWithTimezone = useCallback((date) => {
    const adjustedDate = new Date(date);
    const timezoneOffsetInHours = Math.abs(new Date().getTimezoneOffset()) / 60;
    adjustedDate.setHours(adjustedDate.getHours() + timezoneOffsetInHours);
    return adjustedDate;
  }, []);

  // API operations for events
  const handleCreateEvent = useCallback(
    async (eventData) => {
      if (!userId) return;

      try {
        const apiUrl = `${baseUrl}/api/events/create`;

        const adjustedStartDate = adjustDateWithTimezone(eventData.start);
        const adjustedEndDate = adjustDateWithTimezone(eventData.end);

        await axios.post(
          apiUrl,
          {
            userId,
            title: eventData.title,
            startdate: adjustedStartDate.toISOString(),
            enddate: adjustedEndDate.toISOString(),
            description: eventData.description || "",
            type: eventData.type || eventType,
            priority: eventData.priority || 1,
            place: eventData.place || "",
          },
          {
            timeout: 10000,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            validateStatus: (status) => status >= 200 && status < 300,
          }
        );

        setShowEventModal(false);
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error creating event:", error);
        if (error.response) {
          console.error(
            "API error:",
            error.response.status,
            error.response.statusText
          );
        } else if (error.request) {
          console.error("No response received from API");
        }
      }
    },
    [userId, baseUrl, eventType, adjustDateWithTimezone]
  );

  const handleUpdateEvent = useCallback(
    async (eventData) => {
      if (!userId || !selectedEvent?.ID) return;

      try {
        const apiUrl = `${baseUrl}/api/events/update/${selectedEvent.ID}`;

        const adjustedStartDate = adjustDateWithTimezone(eventData.start);
        const adjustedEndDate = adjustDateWithTimezone(eventData.end);

        await axios.put(
          apiUrl,
          {
            userId,
            title: eventData.title,
            startdate: adjustedStartDate.toISOString(),
            enddate: adjustedEndDate.toISOString(),
            description: eventData.description || "",
            type: eventData.type || selectedEvent.type,
            priority: eventData.priority || selectedEvent.priority,
            place: eventData.place || selectedEvent.place,
          },
          {
            timeout: 10000,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            validateStatus: (status) => status >= 200 && status < 300,
          }
        );

        setShowEditModal(false);
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error updating event:", error);
      }
    },
    [userId, baseUrl, selectedEvent, adjustDateWithTimezone]
  );

  const handleDeleteEvent = useCallback(async () => {
    if (!userId || !selectedEvent?.ID) return;

    try {
      const apiUrl = `${baseUrl}/api/events/delete/${selectedEvent.ID}`;

      await axios.delete(apiUrl, {
        data: { userId },
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status >= 200 && status < 300,
      });

      setShowEditModal(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }, [userId, baseUrl, selectedEvent]);

  // Event handlers for calendar interactions
  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
  }, []);

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

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Render calendar with appropriate height
  const renderCalendar = useCallback(
    (height = "31.25rem") => (
      <Calendar
        localizer={localizer}
        culture="fr"
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        defaultView="week"
        view={currentView}
        date={currentDate}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        views={["month", "week", "day", "agenda"]}
        style={{ height }}
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
        messages={CALENDAR_MESSAGES}
        formats={CALENDAR_FORMATS}
        eventPropGetter={eventStyleGetter}
        ref={calendarRef}
      />
    ),
    [
      events,
      handleNavigate,
      handleSelectEvent,
      handleSelectSlot,
      handleViewChange,
      currentDate,
      currentView,
      eventStyleGetter,
    ]
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="calendar-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        )}
        {renderCalendar("31.25rem")}
      </div>

      <div className="flex justify-end mt-3">
        <Button
          onClick={toggleFullscreen}
          className="w-10 h-9 flex items-center justify-center bg-accent"
          aria-label={isFullscreen ? "Réduire" : "Agrandir"}
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </Button>
      </div>

      {/* Fullscreen Modal */}
      <Modal
        show={isFullscreen}
        onClose={toggleFullscreen}
        size="full"
        position="center"
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <div className="calendar-container">{renderCalendar("100vh")}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center bg-accent"
            aria-label="Réduire"
          >
            <FaCompress />
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Event Modals */}
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
