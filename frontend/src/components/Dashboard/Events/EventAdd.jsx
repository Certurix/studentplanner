import React, { useState } from "react";
import { RangePicker } from "react-minimal-datetime-range";
import "react-minimal-datetime-range/lib/react-minimal-datetime-range.css";
import useUser from "../../../hooks/useUser";

const EventAdd = ({ close }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    type: "",
    priority: "",
    place: "",
  });

  const { userId } = useUser();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDateChange = (dates) => {
    console.log(dates);
    setFormData((prevData) => ({
      ...prevData,
      startDate: dates[0],
      endDate: dates[1],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, startDate, endDate, description, type, priority, place } =
      formData;

    fetch("http://localhost:8000/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        startdate: startDate,
        enddate: endDate,
        description,
        type,
        priority,
        place,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Erreur lors de la requête");
        }
        return res.json();
      })
      .then(() => {
        setFormData({
          title: "",
          startDate: "",
          endDate: "",
          description: "",
          type: "",
          priority: "",
          place: "",
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Ajouter un événement</h2>
        <button onClick={close} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} id="event-add-form">
        {[
          { id: "title", label: "Titre", type: "text", placeholder: "Titre" },
          { id: "place", label: "Lieu", type: "text", placeholder: "Lieu" },
        ].map(({ id, label, type, placeholder }) => (
          <div className="mb-4" key={id}>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={id}
            >
              {label}
            </label>
            <input
              id={id}
              type={type}
              value={formData[id]}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={placeholder}
            />
          </div>
        ))}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date-range"
          >
            Date
          </label>
          <RangePicker
            locale="fr"
            allowPageClickToClose={true}
            placeholder={["Date de début", "Date de fin"]}
            defaultDates={[formData.startDate, formData.endDate]}
            onConfirm={handleDateChange}
            style={{ width: "100%", margin: "0 auto"}}
          />
        </div>
        {[
          {
            id: "type",
            label: "Type",
            options: [
              "Sélectionner un type",
              "Personnel",
              "Scolaire",
              "Professionnel",
            ],
          },
          {
            id: "priority",
            label: "Prioritée",
            options: [
              "Sélectionner une prioritée",
              "Basse",
              "Moyenne",
              "Haute",
            ],
          },
        ].map(({ id, label, options }) => (
          <div className="mb-4" key={id}>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={id}
            >
              {label}
            </label>
            <select
              id={id}
              value={formData[id]}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {options.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Event Description"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventAdd;