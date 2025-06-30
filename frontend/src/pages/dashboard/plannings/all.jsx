import React from "react";
import Planning from "@/components/Planning";
import useAllPlanningEvents from "@/hooks/useAllPlanningEvents";

/**
 * All plannings component - shows events from all planning types
 * Combines personal (type 1), academic (type 2), and professional (type 3) events
 * Provides a comprehensive view of the user's complete schedule
 */
const PlanningAll = () => {
	// Fetch events from all planning types (personal, academic, professional)
	const { events, isLoading } = useAllPlanningEvents("PlanningAll");

	// Show loading state while events are being fetched
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
					<p className="text-gray-500">Chargement de tous vos plannings...</p>
				</div>
			</div>
		);
	}

	return (
		<Planning 
			title="Tous les plannings" 
			initialEvents={events} 
		/>
	);
};

export default PlanningAll;
