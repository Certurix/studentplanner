import React, { useState, useEffect } from "react";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { getEventTypeLabel, getEventTypeColor } from "@/utils/constants";

const TimeDistribution = () => {
  const [data, setData] = useState([]);
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
          // Ensure events is an array before processing
          const events = Array.isArray(response.data) ? response.data : [];
          const totalEvents = events.length;
          // Check for events types
          const eventTypeCounts = {};
          events.forEach((event) => {
            const label = getEventTypeLabel(event.type);
            if (!eventTypeCounts[label]) eventTypeCounts[label] = { count: 0, color: getEventTypeColor(event.type) };
            eventTypeCounts[label].count++;
          });
          const eventData = Object.keys(eventTypeCounts).map((key) => ({
            label: key,
            value:
              totalEvents > 0
                ? ((eventTypeCounts[key].count / totalEvents) * 100).toFixed(2)
                : 0,
            color: eventTypeCounts[key].color,
          }));

          setData(eventData);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [userId, currentMonth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-accent">
        RÉPARTITION TYPE D'ÉVÉNEMENT
      </h2>
      {data.map((item, index) => (
        <div key={index} className="mb-4">
          <p className="mb-1">{item.label}</p>
          <div className="w-full bg-gray-200 rounded-lg h-4">
            <div
              className={`${item.color} h-full rounded-lg`}
              style={{ width: `${item.value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeDistribution;