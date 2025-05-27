import React from "react";
import { Button, ButtonGroup } from "flowbite-react";

/**
 * CustomToolbar component for calendar navigation and view switching.
 */
const CustomToolbar = ({ label, onNavigate, onView, view }) => {
	// Navigation handlers
	const goToBack = () => {
		onNavigate("PREV");
	};

	const goToNext = () => {
		onNavigate("NEXT");
	};

	const goToCurrent = () => {
		onNavigate("TODAY");
	};

	return (
		<nav className="flex flex-col md:flex-row justify-between items-center mb-3" aria-label="Calendar toolbar">
			<span className="rbc-toolbar-label mb-2 md:mb-0">{label}</span>
			<div className="flex flex-row gap-2">
				<ButtonGroup className="" aria-label="Navigation">
					<Button color="blue" onClick={goToBack}>
						Précédent
					</Button>
					<Button color="blue" onClick={goToCurrent}>
						Aujourd&apos;hui
					</Button>
					<Button color="blue" onClick={goToNext}>
						Suivant
					</Button>
				</ButtonGroup>
				<ButtonGroup className="" aria-label="View">
					<Button
						color={view === "month" ? "blue" : "gray"}
						onClick={() => onView("month")}
						aria-pressed={view === "month"}
					>
						Mois
					</Button>
					<Button
						color={view === "week" ? "blue" : "gray"}
						onClick={() => onView("week")}
						aria-pressed={view === "week"}
					>
						Semaine
					</Button>
					<Button
						color={view === "day" ? "blue" : "gray"}
						onClick={() => onView("day")}
						aria-pressed={view === "day"}
					>
						Jour
					</Button>
				</ButtonGroup>
			</div>
		</nav>
	);
};

export default CustomToolbar;