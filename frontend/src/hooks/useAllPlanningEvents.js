import { useState, useEffect } from "react";
import axios from "axios";
import useUser from "@/hooks/useUser";

/**
 * Custom hook for fetching all planning events (from all types)
 * Combines events from personal (type 1), academic (type 2), and professional (type 3) plannings
 * @param {string} logPrefix - Prefix for console logs to identify the source component
 */
const useAllPlanningEvents = (logPrefix = "AllPlanningEvents") => {
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { userId } = useUser();
	const currentMonth = new Date().getMonth() + 1;

	useEffect(() => {
		let isMounted = true;

		const fetchAllEvents = async () => {
			// Early return if no userId available
			if (userId === null) {
				console.log(`[${logPrefix}] Waiting for user authentication...`);
				return;
			}

			setIsLoading(true);

			try {
				const baseUrl = import.meta.env.VITE_API_URL || "";
				
				// Fetch events from all three planning types in parallel
				const eventPromises = [1, 2, 3].map(eventType => {
					const apiUrl = `${baseUrl}/api/events/${userId}/month/${currentMonth}?type=${eventType}`;
					console.log(`[${logPrefix}] Fetching type ${eventType} events from:`, apiUrl);
					
					return axios.get(apiUrl, {
						timeout: 10000,
						headers: { "Accept": "application/json" },
						validateStatus: (status) => status >= 200 && status < 300
					});
				});

				const responses = await Promise.all(eventPromises);
				
				if (isMounted) {
					// Combine all events from all types
					const allEvents = [];
					
					responses.forEach((response, index) => {
						const eventType = index + 1; // 1, 2, or 3
						const isValidResponse = response?.data && Array.isArray(response.data);
						
						if (isValidResponse) {
							// Add events with their type preserved
							allEvents.push(...response.data);
						} else {
							console.warn(`[${logPrefix}] Invalid response format for type ${eventType}:`, response);
						}
					});

					// Sort events by start date
					allEvents.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));
					
					setEvents(allEvents);
					console.log(`[${logPrefix}] Successfully loaded ${allEvents.length} events from all planning types`);
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

		fetchAllEvents();

		return () => {
			isMounted = false;
		};
	}, [userId, currentMonth, logPrefix]);

	return { events, isLoading };
};

export default useAllPlanningEvents;
