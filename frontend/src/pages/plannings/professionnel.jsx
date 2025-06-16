import React from "react";
import Planning from "@/components/Planning";
import usePlanningEvents from "@/hooks/usePlanningEvents";

/**
 * Professional planning component
**/
const PlanningPro = () => {
	// Event type 3 represents professional/work events
	const { events } = usePlanningEvents(3, "PlanningPro");

	return (
		<Planning 
			title="Planning professionnel" 
			initialEvents={events} 
		/>
	);
};

export default PlanningPro;