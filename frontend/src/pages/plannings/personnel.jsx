import React, { useState, useEffect } from "react";
import Planning from "../../components/Planning";
import axios from "axios";
import useUser from "../../hooks/useUser";

const PlanningPerso = () => {
  const [events, setEvents] = useState([]);
  const { userId } = useUser();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (userId !== null) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/events/${userId}/month/${currentMonth}?type=1`
          );
          setEvents(response.data);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();
    }
  }, [userId, currentMonth]);

  return <Planning title="Planning personnel" initialEvents={events} />;
};

export default PlanningPerso;