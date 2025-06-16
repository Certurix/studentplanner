export const EVENT_TYPES = {
    "1": { label: "Personnel", color: "bg-orange-500" },
    "2": { label: "Scolaire", color: "bg-blue-500" },
    "3": { label: "Professionnel", color: "bg-green-500" },
    "4": { label: "Tous", color: "bg-gray-500" },
    // Add more types as needed
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