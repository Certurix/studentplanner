export const EVENT_TYPES = {
  1: {
    label: "Personnel",
    color: "#f97316",
    twClass: "bg-event-personnel",
  },
  2: {
    label: "Scolaire",
    color: "#3b82f6",
    twClass: "bg-event-scolaire",
  },
  3: {
    label: "Professionnel",
    color: "#10b981",
    twClass: "bg-event-professionnel",
  },
  4: { label: "Tous", color: "#6b7280", twClass: "bg-event-tous" },
};

// Get label by type (handles string or number input)
export function getEventTypeLabel(type) {
  const key = String(type);
  return EVENT_TYPES[key]?.label || "Inconnu";
}

// Get color by type (handles string or number input)
export function getEventTypeColor(type) {
  const key = String(type);
  return EVENT_TYPES[key]?.color || "#9ca3af";
}

export function getEventTypeTwClass(type) {
  const key = String(type);
  return EVENT_TYPES[key]?.twClass || "bg-gray-200";
}

export const CALENDAR_CONFIG = {
  messages: {
    allDay: "Toute la journée",
    previous: "Précédent",
    next: "Suivant",
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    agenda: "Agenda",
    date: "Date",
    time: "Heure",
    event: "Événement",
    noEventsInRange: "Aucun événement dans cette période.",
    showMore: (total) => `+ ${total} plus`,
  },
  formats: {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
        end,
        "HH:mm",
        culture
      )}`,
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
        end,
        "HH:mm",
        culture
      )}`,
  },
};

export const PRIORITY_STYLES = {
  1: "border-1",
  2: "border-2",
  3: "border-4",
};
