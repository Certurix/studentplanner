import React, { useState, useEffect } from "react";
import axios from "axios";
import useUser from "../../hooks/useUser";

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

  const {userId} = useUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/events/${userId}/month/${
            new Date().getMonth() + 1
          }`
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const getEventForDay = (day) => {
    return events.find((event) => new Date(event.startdate).getDate() === day);
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
          const event = getEventForDay(day);
          return (
            <div
              key={i}
              className={`p-2 rounded-full text-sm ${
                event ? "bg-indigo-200 text-indigo-700" : "text-gray-700"
              }`}
              style={{ width: "30px", height: "30px", lineHeight: "15px" }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmallCalendar;
