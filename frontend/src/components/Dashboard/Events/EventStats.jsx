import React, { useState, useEffect } from "react";
import axios from "axios";
import useUser from "../../../hooks/useUser";

export default function EventStats() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {userId} = useUser();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (userId !== null) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/events/${userId}/month/${currentMonth}`
          );
          setEvents(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [userId, currentMonth]);

  // Ensure events is an array and calculate stats
  const currentDate = new Date();
  const safeEvents = Array.isArray(events) ? events : [];
  const achievedEvents = safeEvents.filter(
    (event) => new Date(event.enddate) < currentDate
  ).length;
  const upcomingEvents = safeEvents.length - achievedEvents;
  const totalEvents = safeEvents.length;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-accent">
      ÉVÉNEMENTS DU MOIS
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <p className="text-xl font-semibold">Achevés</p>
          <div className="flex items-center">
            <p className="text-3xl font-bold">{achievedEvents}</p>
            <div className="w-0.5 h-6 bg-black mx-2 transform rotate-[-28rad]"></div>
            <p className="text-xl font-bold">{totalEvents}</p>
          </div>
        </div>
        <div className="h-0.5 md:h-12 w-full md:w-0.5 bg-gray-300 my-4 md:my-0 md:mx-4"></div>
        <div>
          <p className="text-xl font-semibold">À venir</p>
          <div className="flex items-center">
            <p className="text-3xl font-bold">{upcomingEvents}</p>
            <div className="w-0.5 h-6 bg-black mx-2 transform rotate-[-28rad]"></div>
            <p className="text-xl font-bold">{totalEvents}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
