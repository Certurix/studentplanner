import React, { useState, useEffect } from "react";
import Planning from "../../components/Planning";
import axios from "axios";
import useUser from "../../hooks/useUser";

const PlanningPro = () => {
  const [events, setEvents] = useState([]);
  const { userId } = useUser();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (userId !== null) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/events/${userId}/month/${currentMonth}?type=3`
          );
          setEvents(response.data);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();
    }
  }, [userId, currentMonth]);

  return <Planning title="Planning professionnel" initialEvents={events} />;
};

export default PlanningPro;