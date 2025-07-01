import React, { useState, useEffect } from "react";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { getEventTypeTwClass } from "@/utils/constants";

const EventItem = ({ color, title, date }) => (
  <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-md">
    <div className="flex items-center">
      <span className={`w-3 h-3 rounded-full mr-4 ${color}`} />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
    <button className="text-gray-500">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </button>
  </div>
);

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useUser();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (userId !== null) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/events/${userId}/month/${currentMonth}?future=true`
          );
          // Ensure response.data is an array before filtering and mapping
          const responseData = Array.isArray(response.data)
            ? response.data
            : [];

          const currentDate = new Date();
          const upcomingEvents = responseData.filter(
            (event) => new Date(event.enddate) >= currentDate
          );

          const fetchedEvents = upcomingEvents.map((event) => ({
            color: getEventTypeTwClass(event.type),
            title: event.title,
            date: formatDate(event.startdate, event.enddate),
          }));
          setEvents(fetchedEvents);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [userId, currentMonth]);

  const formatDate = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString(
      "fr-FR"
    )} | ${startDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${endDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        ÉVÉNEMENTS À VENIR
      </h2>
      {events.length > 0 ? (
        events.map((event, index) => <EventItem key={index} {...event} />)
      ) : (
        <p>Aucun événement à venir ce mois-ci.</p>
      )}
    </div>
  );
};

export default EventsList;
