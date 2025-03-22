import React, { useState } from "react";
import DateTimePicker from "react-tailwindcss-datetimepicker";
import { Label, TextInput, Select, Textarea } from "flowbite-react";
import useUser from "../../../hooks/useUser";

const EventAdd = ({ close }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    type: "",
    priority: "",
    place: "",
  });

  const locale = {
    format: "dd-MM-yyyy HH:mm", // Voir: https://date-fns.org/v2.16.1/docs/format
    sundayFirst: false,
    days: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    months: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    fromDate: "De",
    toDate: "Jusqu'à",
    selectingFrom: "Sélection de",
    selectingTo: "Sélection jusqu'à",
    minDate: "Date min",
    maxDate: "Date max",
    close: "Fermer",
    apply: "Appliquer",
    cancel: "Annuler",
  };

  const { userId } = useUser();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDateChange = (startDate, endDate) => {
    setFormData((prevData) => ({
      ...prevData,
      startDate,
      endDate,
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
          startDate: new Date(),
          endDate: new Date(),
          description: "",
          type: "",
          priority: "",
          place: "",
        });
        close(); // Close modal after successful submission
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
        <div className="mb-4">
          <div className="block">
            <Label htmlFor="title" value="Titre" />
          </div>
          <TextInput
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow-sm w-full"
            required
          />
        </div>
        
        <div className="mb-4">
          <div className="block">
            <Label htmlFor="place" value="Lieu" />
          </div>
          <TextInput
            id="place"
            value={formData.place}
            onChange={handleChange}
            className="shadow-sm w-full"
          />
        </div>
        
        <div className="mb-4">
          <Label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date-range"
            value="Date"
          />
          <DateTimePicker
            locale={locale}
            leftMode={true}
            forceMobileMode={true}
            start={formData.startDate}
            end={formData.endDate}
            applyCallback={handleDateChange}
            ranges={{
              "Aujourd'hui": [new Date().setHours(0, 0, 0, 0), new Date()],
              "30 derniers jours": [
                new Date(new Date().setDate(new Date().getDate() - 30)),
                new Date(),
              ],
            }}
          >
            <div className="w-full p-2 border border-gray-300 rounded text-left">
              {`${formData.startDate.toLocaleDateString('fr-FR')} - ${formData.endDate.toLocaleDateString('fr-FR')}`}
            </div>
          </DateTimePicker>
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
            <div className="block">
              <Label htmlFor={id} value={label} />
            </div>
            <Select
              id={id}
              value={formData[id]}
              onChange={handleChange}
              className="shadow-sm w-full"
            >
              {options.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        ))}
        <div className="mb-6">
          <div className="block">
            <Label htmlFor="description" value="Description" />
          </div>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow-sm w-full"
            rows={4}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventAdd;