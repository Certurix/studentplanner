import React, { useState } from "react";
import { Datepicker } from "flowbite-react";
import useUser from "../../../hooks/useUser";

const EventAdd = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [place, setPlace] = useState("");

  const userId = useUser();

  const addEventForm = document.getElementById("event-add-form");
  const datepickerStartDate = document.getElementById(
    "modal-eventadd-startdate"
  );
  const datepickerEndDate = document.getElementById("modal-eventadd-enddate");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      userId,
      title,
      startDate,
      endDate,
      description,
      type,
      priority,
      place,
    });

    // Envoi de la requête au serveur backend
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
      .then((data) => {
        addEventForm.reset();
        datepickerStartDate.clear();
        datepickerEndDate.clear();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Ajouter un événement</h2>
      <form onSubmit={handleSubmit} className="" id="event-add-form">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Titre"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="startDate"
          >
            Date de début
          </label>
          <Datepicker
            id="modal-eventadd-startdate"
            minDate={new Date()}
            language="fr-FR"
            labelTodayButton="Aujourd'hui"
            labelClearButton="Effacer"
            onChange={(date) => setStartDate(date ? date.toJSON() : "")}
            icon={false}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="endDate"
          >
            Date de fin
          </label>
          <Datepicker
            id="modal-eventadd-enddate"
            minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
            language="fr-FR"
            labelTodayButton="Aujourd'hui"
            labelClearButton="Effacer"
            onChange={(date) => setEndDate(date ? date.toJSON() : "")}
            icon={false}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="eventType"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(Number(e.target.value))}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="0">Sélectionner un type</option>
            <option value="1">Personnel</option>
            <option value="2">Scolaire</option>
            <option value="3">Professionnel</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="priority"
          >
            Prioritée
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="0">Sélectionner une prioritée</option>
            <option value="1">Basse</option>
            <option value="2">Moyenne</option>
            <option value="3">Haute</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="place"
          >
            Lieu
          </label>
          <input
            id="place"
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Place"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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