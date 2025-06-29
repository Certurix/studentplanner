import React from "react";
import Planning from "@/components/Planning";
import usePlanningEvents from "@/hooks/usePlanningEvents";

/**
 * School planning component
**/
const PlanningScolaire = () => {
	// Event type 2 represents school/academic events
	const { events } = usePlanningEvents(2, "PlanningScolaire");

	return (
		<Planning 
			title="Planning scolaire" 
			initialEvents={events} 
		/>
	);
};

export default PlanningScolaire;