import React, { useState, useEffect } from "react";
import axios from "axios";
import useUser from "../../../hooks/useUser";

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
            `http://localhost:8000/events/${userId}/month/${currentMonth}`
          );
          const events = response.data;
          const totalEvents = events.length;
          console.log(events)
          const eventTypes = {
            Personnel: { count: 0, color: "bg-orange-500" },
            Professionnel: { count: 0, color: "bg-yellow-500" },
            Scolaire: { count: 0, color: "bg-blue-500" },
          };

          events.forEach((event) => {
            switch (event.type) {
              case "1":
                eventTypes.Personnel.count++;
                break;
              case "2":
                eventTypes.Scolaire.count++;
                break;
              case "3":
                eventTypes.Professionnel.count++;
                break;
              default:
                break;
            }
          });

          const eventData = Object.keys(eventTypes).map((key) => ({
            label: key,
            value:
              totalEvents > 0
                ? ((eventTypes[key].count / totalEvents) * 100).toFixed(2)
                : 0,
            color: eventTypes[key].color,
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
      <h2 className="text-xl font-semibold mb-4">RÉPARTITION PLANNINGS</h2>
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