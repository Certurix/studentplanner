import React, { useState, useEffect } from "react";
import Planning from "@/components/Planning";
import axios from "axios";
import useUser from "@/hooks/useUser";

const PlanningPerso = () => {
	const [events, setEvents] = useState([]);
	const { userId } = useUser();
	const currentMonth = new Date().getMonth() + 1;

	useEffect(() => {
		let isMounted = true;
		
		const fetchEvents = async () => {
			// Wait for user authentication
			if (userId === null) return;
			
			try {
				const baseUrl = import.meta.env.VITE_API_URL || "";
				const apiUrl = `${baseUrl}/api/events/${userId}/month/${currentMonth}?type=1`;
				
				const response = await axios.get(apiUrl, {
					timeout: 10000,
					headers: { "Accept": "application/json" }
				});
				
				// Update events only if component is still mounted and response is valid
				if (isMounted && Array.isArray(response.data)) {
					setEvents(response.data);
				}
			} catch (error) {
				console.error("[PlanningPerso] Failed to fetch events:", error.message);
				
				// Reset events on error if component is still mounted
				if (isMounted) {
					setEvents([]);
				}
			}
		};

		fetchEvents();
		
		return () => {
			isMounted = false;
		};
	}, [userId, currentMonth]);

	return (
		<Planning 
			title="Planning personnel" 
			initialEvents={events} 
		/>
	);
};

export default PlanningPerso;