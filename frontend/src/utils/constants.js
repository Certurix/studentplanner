export const EVENT_TYPES = {
  1: { label: "Personnel", color: "#f97316" },
  2: { label: "Scolaire", color: "#3b82f6" },
  3: { label: "Professionnel", color: "#10b981" },
  4: { label: "Tous", color: "#6b7280" },
};

// Get label by type (handles string or number input)
export function getEventTypeLabel(type) {
  const key = String(type);
  return EVENT_TYPES[key]?.label || "Inconnu";
}

// Get color by type (handles string or number input)
export function getEventTypeColor(type) {
  const key = String(type);
  return EVENT_TYPES[key]?.color || "bg-gray-500";
}
