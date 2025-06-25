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
