import React from "react";
import Planning from "@/components/Planning";
import usePlanningEvents from "@/hooks/usePlanningEvents";

/**
 * Personal planning components 
**/
const PlanningPerso = () => {
	// Event type 1 represents personal/private events
	const { events } = usePlanningEvents(1, "PlanningPerso");

	return (
		<Planning
			title="Planning personnel"
			initialEvents={events}
		/>
	);
};

export default PlanningPerso;