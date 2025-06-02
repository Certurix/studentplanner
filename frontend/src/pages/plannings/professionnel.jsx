import React, { useState, useEffect } from "react";
import Planning from "@/components/Planning";
import axios from "axios";
import useUser from "@/hooks/useUser";

const PlanningPro = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useUser();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    // Keep track of component mount state to prevent state updates after unmount
    let isMounted = true;
    
    const fetchEvents = async () => {
      // Don't attempt to fetch without a userId
      if (userId === null) {
        console.log("Waiting for user authentication...");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // API base URL with fallback to relative path
        const baseUrl = import.meta.env.VITE_API_URL || "";
        const apiUrl = `${baseUrl}/api/events/${userId}/month/${currentMonth}?type=3`;
        
        console.log("[PlanningPro] Fetching events from:", apiUrl);
        
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
        
        // Safe check for the response format
        if (isMounted) {
          const isValidResponse = response?.data && Array.isArray(response.data);
          setEvents(isValidResponse ? response.data : []);
          
          if (!isValidResponse) {
            console.warn("[PlanningPro] Invalid response format:", response);
          }
        }
      } catch (error) {
        console.error("[PlanningPro] Error fetching events:", error);
        
        // Log more detailed error information
        if (error.response) {
          console.error(
            "[PlanningPro] API error response:", 
            error.response.status,
            error.response.statusText
          );
        } else if (error.request) {
          console.error("[PlanningPro] No response received from API:", error.message);
        }
        
        // Only update state if component is still mounted
        if (isMounted) {
          setEvents([]);
        }
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Fetch events immediately
    fetchEvents();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [userId, currentMonth]);

  return (
    <Planning 
      title="Planning professionnel" 
      initialEvents={events} 
    />
  );
};

export default PlanningPro;