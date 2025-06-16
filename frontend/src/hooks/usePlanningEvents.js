import { useState, useEffect } from "react";
import axios from "axios";
import useUser from "@/hooks/useUser";

/**
 * Custom hook for fetching planning events by type
 * Handles loading states, error handling, and cleanup automatically
 * @param {number} eventType - The type of events to fetch (2 for school, 3 for professional)
 * @param {string} logPrefix - Prefix for console logs to identify the source component
 */
const usePlanningEvents = (eventType, logPrefix = "PlanningEvents") => {
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { userId } = useUser();
	const currentMonth = new Date().getMonth() + 1;

	useEffect(() => {
		let isMounted = true;

		const fetchEvents = async () => {
			// Early return if no userId available
			if (userId === null) {
				console.log(`[${logPrefix}] Waiting for user authentication...`);
				return;
			}

			setIsLoading(true);

			try {
				const baseUrl = import.meta.env.VITE_API_URL || "";
				const apiUrl = `${baseUrl}/api/events/${userId}/month/${currentMonth}?type=${eventType}`;

				console.log(`[${logPrefix}] Fetching events from:`, apiUrl);

				const response = await axios.get(apiUrl, {
					timeout: 10000,
					headers: { "Accept": "application/json" },
					validateStatus: (status) => status >= 200 && status < 300
				});

				if (isMounted) {
					const isValidResponse = response?.data && Array.isArray(response.data);
					setEvents(isValidResponse ? response.data : []);

					if (!isValidResponse) {
						console.warn(`[${logPrefix}] Invalid response format:`, response);
					}
				}
			} catch (error) {
				console.error(`[${logPrefix}] Error fetching events:`, error);

				if (error.response) {
					console.error(
						`[${logPrefix}] API error response:`,
						error.response.status,
						error.response.statusText
					);
				} else if (error.request) {
					console.error(`[${logPrefix}] No response received from API:`, error.message);
				}

				if (isMounted) {
					setEvents([]);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		fetchEvents();

		return () => {
			isMounted = false;
		};
	}, [userId, currentMonth, eventType, logPrefix]);

	return { events, isLoading };
};

export default usePlanningEvents;
