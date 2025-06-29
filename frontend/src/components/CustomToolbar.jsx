import React from "react";
import { Button, ButtonGroup } from "flowbite-react";

/**
 * CustomToolbar component for calendar navigation and view switching.
 */
const CustomToolbar = ({ label, onNavigate, onView, view }) => {
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
    <nav
      className="flex flex-col md:flex-row justify-between items-center mb-3"
      aria-label="Calendar toolbar"
    >
      <span className="rbc-toolbar-label mb-2 md:mb-0">{label}</span>
      <div className="flex flex-row gap-2">
        <ButtonGroup aria-label="Navigation">
          <Button
            className="bg-accent hover:bg-primary_hover"
            onClick={goToBack}
          >
            Précédent
          </Button>
          <Button className="bg-accent" onClick={goToCurrent}>
            Aujourd&apos;hui
          </Button>
          <Button className="bg-accent" onClick={goToNext}>
            Suivant
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="View">
          <Button
            className={view === "month" ? "bg-accent" : ""}
            onClick={() => onView("month")}
            aria-pressed={view === "month"}
          >
            Mois
          </Button>
          <Button
            className={view === "week" ? "bg-accent" : ""}
            onClick={() => onView("week")}
            aria-pressed={view === "week"}
          >
            Semaine
          </Button>
          <Button
            className={view === "day" ? "bg-accent" : ""}
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
