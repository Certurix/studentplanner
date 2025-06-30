import React, { useState, useEffect } from "react";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { getEventTypeTwClass } from "@/utils/constants";

const SmallCalendar = () => {
  const [events, setEvents] = useState([]);
  const daysOfWeek = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
  const currentMonth = new Date()
    .toLocaleString("fr-FR", { month: "long" })
    .toUpperCase();
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  const { userId } = useUser();

  useEffect(() => {
    if (userId !== null) {
      const fetchEvents = async () => {
        try {
          // Get the base URL from environment variables or use an empty string as fallback
          const baseUrl = import.meta.env.VITE_API_URL || "";

          // Fetch all events for the current month
          const response = await axios.get(
            `${baseUrl}/api/events/${userId}/month/${new Date().getMonth() + 1}`
          );
          setEvents(response.data);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();
    }
  }, [userId]);

  /**
   * Get events for a specific day
   * @param {number} day - The day of the month
   * @returns {Array} - Array of events for that day
   */
  const getEventsForDay = (day) => {
    // Ensure events is an array before filtering
    if (!Array.isArray(events)) return [];

    // Filter events that occur on the specified day
    return events.filter((event) => {
      const eventDate = new Date(event.startdate);
      return eventDate.getDate() === day;
    });
  };

  /**
   * Determine the style class for a day based on its events
   * @param {number} day - The day of the month
   * @returns {string} - CSS class string
   */
  const getDayStyle = (day) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length === 0) {
      return "text-gray-700"; // No events
    }
    // If we have multiple events with different types, prioritize them
    // Personal > Professional > Academic
    const eventTypes = dayEvents.map((event) => event.type);
    if (eventTypes.includes("1") || eventTypes.includes(1)) {
      return `${getEventTypeTwClass(1)} text-white`; // Personal event
    } else if (eventTypes.includes("2") || eventTypes.includes(2)) {
      return `${getEventTypeTwClass(2)} text-white`; // Academic event
    } else if (eventTypes.includes("3") || eventTypes.includes(3)) {
      return `${getEventTypeTwClass(3)} text-white`; // Professional event
    }
    // Fallback to the type of the first event
    return `${getEventTypeTwClass(dayEvents[0].type)} text-white`;
  };

  /**
   * Get a tooltip message for the events on a day
   * @param {number} day - The day of the month
   * @returns {string} - Tooltip message listing all events
   */
  const getTooltipText = (day) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length === 0) return "";

    return dayEvents.map((event) => event.title).join(", ");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-6 w-full max-w-md mx-auto">
      <h2 className="text-center text-xl font-semibold mb-4">{currentMonth}</h2>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dayEventStyle = getDayStyle(day);
          const tooltipText = getTooltipText(day);
          const hasEvents = getEventsForDay(day).length > 0;

          return (
            <div
              key={i}
              className={`p-2 rounded-full text-sm ${dayEventStyle} flex items-center justify-center`}
              style={{ width: "30px", height: "30px" }}
              title={tooltipText}
            >
              {day}
              {hasEvents && dayEventStyle === "text-gray-700" && (
                <span
                  className="absolute w-1 h-1 bg-indigo-600 rounded-full"
                  style={{ bottom: "2px" }}
                ></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmallCalendar;
