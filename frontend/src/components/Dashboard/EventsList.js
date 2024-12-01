import React from "react";

const EventItem = ({ color, title, date }) => (
  <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-md">
    <div className="flex items-center">
      <span className={`w-3 h-3 rounded-full mr-4 ${color}`} />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
    <button className="text-gray-500">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </button>
  </div>
);

const EventsList = () => {
  const events = [
    {
      color: "bg-red-500",
      title: "RDV médecin",
      date: "04.04 | 14:00 - 15:00",
    },
    {
      color: "bg-yellow-500",
      title: "Remplir le contrat d’étude",
      date: "04.07 | 14:00 - 15:00",
    },
    {
      color: "bg-purple-500",
      title: "Reviser Algèbre de BOOLE",
      date: "04.08 | 14:00 - 15:00",
    },
    {
      color: "bg-blue-500",
      title: "Soutenance",
      date: "04.11 | 13:00 - 17:00",
    },
    {
      color: "bg-green-500",
      title: "Entretien stage",
      date: "04.13 | 10:00 - 13:00",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">ÉVÉNEMENTS À VENIR</h2>
      {events.map((event, index) => (
        <EventItem key={index} {...event} />
      ))}
    </div>
  );
};

export default EventsList;
