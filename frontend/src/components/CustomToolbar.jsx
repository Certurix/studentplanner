// src/components/CustomToolbar.js

import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

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
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="rbc-toolbar-label">{label}</span>
      <ButtonGroup aria-label="Toolbar" className="ml-auto">
        <Button variant="primary" onClick={goToBack}>
          Précédent
        </Button>
        <Button variant="primary" onClick={goToCurrent}>
          Aujourd'hui
        </Button>
        <Button variant="primary" onClick={goToNext}>
          Suivant
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="View" className="ml-2">
        <Button variant={view === "month" ? "secondary" : "primary"} onClick={() => onView("month")}>
          Mois
        </Button>
        <Button variant={view === "week" ? "secondary" : "primary"} onClick={() => onView("week")}>
          Semaine
        </Button>
        <Button variant={view === "day" ? "secondary" : "primary"} onClick={() => onView("day")}>
          Jour
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default CustomToolbar;