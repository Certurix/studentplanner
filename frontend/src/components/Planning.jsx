import React, { useState, useRef, useEffect } from "react";

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

// Hooks
import useUser from "@/hooks/useUser";

moment.locale("fr");
const localizer = momentLocalizer(moment);

// Calendar translation fields
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
  [EVENT_TYPES.PERSONAL]: "#4CAF50",
  [EVENT_TYPES.ACADEMIC]: "#9C27B0",
  [EVENT_TYPES.PROFESSIONAL]: "#FF9800",
  default: "#3174ad",
};

const PRIORITY_BORDER_WIDTH = {
  1: "1px", // Low
  2: "2px", // Medium
  3: "3px", // High
};

// Event style generator based on event type and priority
const eventStyleGetter = (event) => {
  const backgroundColor = TYPE_COLORS[event.type] || TYPE_COLORS.default;
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
};

const Planning = ({ title, initialEvents }) => {
  const { userId } = useUser();

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

  const calendarRef = useRef(null);

  // Determine event type from planning title
  const getTypeFromTitle = () => {
    if (title.includes("personnel")) return EVENT_TYPES.PERSONAL;
    if (title.includes("scolaire")) return EVENT_TYPES.ACADEMIC;
    if (title.includes("professionnel")) return EVENT_TYPES.PROFESSIONAL;
    return EVENT_TYPES.PERSONAL; // Default
  };

  // Format initial events
  useEffect(() => {
    // Check if initialEvents is an array before using map
    if (initialEvents && Array.isArray(initialEvents)) {
      const formattedEvents = initialEvents.map((event) => ({
        ...event,
        start: new Date(event.startdate),
        end: new Date(event.enddate),
        title: event.title,
      }));
      setEvents(formattedEvents);
    } else {
      // If initialEvents is not an array, set events to empty array
      setEvents([]);
      console.warn("Initial events is not an array or is empty");
    }
  }, [initialEvents]);

  /**
   * This effect handles initialization and refresh of events
   * It uses the refreshTrigger to force re-fetching when needed
   * and properly waits for userId to be available
   */
  useEffect(() => {
    // Track if the component is still mounted when async operations complete
    let isMounted = true;

    const loadEvents = async () => {
      // Don't proceed if userId isn't available yet
      if (!userId) {
        console.log("Waiting for user authentication...");
        return;
      }

      setIsLoading(true);

      try {
        let rangeStart, rangeEnd;

        // Determine date range based on current view
        switch (currentView) {
          case "month":
            rangeStart = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              1
            );
            rangeEnd = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              0
            );
            break;
          case "week":
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() - currentDate.getDay());
            rangeStart = weekStart;

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            rangeEnd = weekEnd;
            break;
          case "day":
            rangeStart = currentDate;
            rangeEnd = currentDate;
            break;
          default: // Agenda view - default to current month
            rangeStart = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              1
            );
            rangeEnd = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              0
            );
        }

        // Only continue if component is still mounted
        if (isMounted) {
          await fetchEvents(rangeStart, rangeEnd, currentView);
        }
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Load events immediately
    loadEvents();

    // Set up a cleanup function
    return () => {
      isMounted = false;
    };
  }, [userId, currentDate, currentView, refreshTrigger]);

  // API functions
  const fetchEvents = async (start, end, viewType) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const eventType = getTypeFromTitle();
      const startMonth = start.getMonth() + 1;
      const endMonth = end.getMonth() + 1;

      let fetchedEvents = [];
      
      /**
       * Helper function to validate API response
       * @param {Object} response - Axios response object
       * @returns {Array} - Valid array of events or empty array
       */
      const validateResponse = (response) => {
        // Check if response has the expected Content-Type
        const contentType = response.headers["content-type"] || "";
        if (!contentType.includes("application/json")) {
          console.error(
            "API returned non-JSON content type:", 
            contentType,
            "Status:", response.status
          );
          return [];
        }
        
        // Validate that data is an array
        if (!Array.isArray(response.data)) {
          console.error("API response is not an array:", typeof response.data);
          return [];
        }
        
        return response.data;
      };

      // API base URL with fallback to relative path
      const baseUrl = import.meta.env.VITE_API_URL || "";
      
      // If viewing a single month or less
      if (startMonth === endMonth || viewType !== "month") {
        try {
          const apiUrl = `${baseUrl}/api/events/${userId}/month/${startMonth}?type=${eventType}`;
          console.log("Fetching events from:", apiUrl);
          
          const response = await axios.get(apiUrl, {
            // Set timeout to prevent long waiting
            timeout: 10000,
            // Ensure we receive JSON response
            headers: {
              "Accept": "application/json"
            },
            // Validate status is 2xx
            validateStatus: (status) => status >= 200 && status < 300
          });
          
          fetchedEvents = validateResponse(response);
        } catch (requestError) {
          // Handle specific request errors
          if (requestError.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(
              "API error:", 
              requestError.response.status,
              requestError.response.statusText
            );
          } else if (requestError.request) {
            // The request was made but no response was received
            console.error("No response received from API:", requestError.message);
          } else {
            // Something happened in setting up the request
            console.error("Error setting up API request:", requestError.message);
          }
          fetchedEvents = [];
        }
      } else {
        // If view spans multiple months (like year view), fetch both months
        try {
          const responses = await Promise.all([
            axios.get(`${baseUrl}/api/events/${userId}/month/${startMonth}?type=${eventType}`, {
              timeout: 10000,
              headers: { "Accept": "application/json" },
              validateStatus: (status) => status >= 200 && status < 300
            }),
            axios.get(`${baseUrl}/api/events/${userId}/month/${endMonth}?type=${eventType}`, {
              timeout: 10000,
              headers: { "Accept": "application/json" },
              validateStatus: (status) => status >= 200 && status < 300
            })
          ]);

          const data1 = validateResponse(responses[0]);
          const data2 = validateResponse(responses[1]);
          
          fetchedEvents = [...data1, ...data2];
        } catch (requestError) {
          console.error("Error fetching events from multiple months:", requestError);
          fetchedEvents = [];
        }
      }

      // Double check that fetchedEvents is an array before using map
      if (!Array.isArray(fetchedEvents)) {
        console.error("Fetched events is not an array:", 
          typeof fetchedEvents === "string" && fetchedEvents.length > 100 
            ? fetchedEvents.substring(0, 100) + "..." 
            : fetchedEvents
        );
        fetchedEvents = [];
      }

      // Format dates
      const formattedEvents = fetchedEvents.map((event) => ({
        ...event,
        start: new Date(event.startdate),
        end: new Date(event.enddate),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error in fetchEvents function:", error);
      setEvents([]); // Set empty events array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    if (!userId) return;

    try {
      // API base URL with fallback to relative path
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const apiUrl = `${baseUrl}/api/events/create`;
      
      console.log("Creating event at:", apiUrl);
      
      await axios.post(apiUrl, {
        userId,
        title: eventData.title,
        startdate: eventData.start,
        enddate: eventData.end,
        description: eventData.description || "",
        type: eventData.type || getTypeFromTitle(),
        priority: eventData.priority || 1,
        place: eventData.place || "",
      }, {
        // Set timeout to prevent long waiting
        timeout: 10000,
        // Ensure we send and receive JSON
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        // Validate status is 2xx
        validateStatus: (status) => status >= 200 && status < 300
      });

      setShowEventModal(false);
      refreshEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      
      // Log more detailed error information
      if (error.response) {
        console.error(
          "API error response:", 
          error.response.status,
          error.response.statusText
        );
      } else if (error.request) {
        console.error("No response received from API");
      }
      
      // Consider adding user-friendly error notification here
      // e.g. setCreateError("Impossible de créer l'événement. Veuillez réessayer.");
    }
  };

  const handleUpdateEvent = async (eventData) => {
    if (!userId || !selectedEvent?.ID) return;
    try {
      // API base URL with fallback to relative path
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const apiUrl = `${baseUrl}/api/events/update/${selectedEvent.ID}`;      
      await axios.put(apiUrl, {
        userId,
        title: eventData.title,
        startdate: eventData.start,
        enddate: eventData.end,
        description: eventData.description || "",
        type: eventData.type || selectedEvent.type,
        priority: eventData.priority || selectedEvent.priority,
        place: eventData.place || selectedEvent.place,
      }, {
        // Set timeout to prevent long waiting
        timeout: 10000,
        // Ensure we send and receive JSON
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        // Validate status is 2xx
        validateStatus: (status) => status >= 200 && status < 300
      });

      setShowEditModal(false);
      refreshEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      
      // Log more detailed error information
      if (error.response) {
        console.error(
          "API error response:", 
          error.response.status,
          error.response.statusText
        );
      } else if (error.request) {
        console.error("No response received from API");
      }
      
      // Consider adding user-friendly error notification here
      // e.g. setUpdateError("Impossible de mettre à jour l'événement. Veuillez réessayer.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!userId || !selectedEvent?.ID) return;

    try {
      // API base URL with fallback to relative path
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const apiUrl = `${baseUrl}/api/events/delete/${selectedEvent.ID}`;

      console.log("Deleting event at:", apiUrl);
      
      await axios.delete(apiUrl, {
        // Include userId in the request data
        data: { userId },
        // Set timeout to prevent long waiting
        timeout: 10000,
        // Ensure we receive JSON
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        // Validate status is 2xx
        validateStatus: (status) => status >= 200 && status < 300
      });
      
      setShowEditModal(false);
      refreshEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      
      // Log more detailed error information
      if (error.response) {
        console.error(
          "API error response:", 
          error.response.status,
          error.response.statusText
        );
      } else if (error.request) {
        console.error("No response received from API");
      }
    }
  };

  // Event handlers
  const refreshEvents = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({
      title: "",
      start,
      end,
      description: "",
      type: getTypeFromTitle(),
      priority: 1,
      place: "",
    });
    setShowEventModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log("Selected event:", event);
    setShowEditModal(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Render calendar component
  const renderCalendar = (height = "31.25rem") => (
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
        <Modal.Header>
          {title}
        </Modal.Header>
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
