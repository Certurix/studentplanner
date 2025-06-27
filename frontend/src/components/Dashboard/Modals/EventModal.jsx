import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
} from "flowbite-react";
import { Icon } from "@iconify-icon/react";
import moment from "moment";
import flatpickr from "flatpickr";
import { French } from "flatpickr/dist/l10n/fr.js";
import "flatpickr/dist/flatpickr.css";

const EventModal = ({
  show,
  onHide,
  event,
  isEdit,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  planningTitle,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
    type: 1,
    priority: 1,
    place: "",
  });

  // Create refs for flatpickr
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        start: event.start || new Date(),
        end: event.end || new Date(),
        description: event.description || "",
        type:
          event.type ||
          (planningTitle.includes("personnel")
            ? 1
            : planningTitle.includes("scolaire")
            ? 2
            : 3),
        priority: event.priority || 1,
        place: event.place || "",
      });
    }
  }, [event, planningTitle]);
  useEffect(() => {
    // Initialize flatpickr instances
    let startPicker, endPicker;

    if (startDateRef.current) {
      startPicker = flatpickr(startDateRef.current, {
        locale: French,
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        defaultDate: formData.start,
        time_24hr: true,
        minuteIncrement: 5,
        onChange: (selectedDates) => {
          handleDateChange("start", selectedDates[0]);

          // Update end date minimum when start date changes
          if (endPicker && selectedDates[0]) {
            endPicker.set("minDate", selectedDates[0]);

            // If end date is now before start date, update it
            if (new Date(formData.end) < selectedDates[0]) {
              const newEndDate = new Date(selectedDates[0]);
              newEndDate.setHours(newEndDate.getHours() + 1);
              endPicker.setDate(newEndDate);
              handleDateChange("end", newEndDate);
            }
          }
        },
      });
    }

    if (endDateRef.current) {
      endPicker = flatpickr(endDateRef.current, {
        locale: French,
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        defaultDate: formData.end,
        time_24hr: true,
        minuteIncrement: 5,
        minDate: formData.start,
        onChange: (selectedDates) => {
          handleDateChange("end", selectedDates[0]);
        },
      });
    }

    // Update flatpickr instances when form data changes
    if (startPicker) startPicker.setDate(formData.start);
    if (endPicker) endPicker.setDate(formData.end);

    // Cleanup function to destroy flatpickr instances
    return () => {
      if (startPicker) startPicker.destroy();
      if (endPicker) endPicker.destroy();
    };
  }, [startDateRef, endDateRef, formData.start, formData.end]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleDateChange = (id, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      onUpdateEvent(formData);
    } else {
      onCreateEvent(formData);
    }
  };

  return (
    <Modal show={show} onClose={onHide} popup className="font-inter">
      <Modal.Header className="mx-2 my-2">
        {isEdit ? "Modifier l'événement" : "Ajouter un événement"}
      </Modal.Header>
      <Modal.Body>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" value="Titre" />
            </div>
            <TextInput
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="place" value="Lieu" />
            </div>
            <TextInput
              id="place"
              value={formData.place}
              onChange={handleChange}
            />
          </div>{" "}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="start" value="Début" />
              </div>
              <TextInput
                type="text"
                id="start"
                value={moment(formData.start).format("YYYY-MM-DD HH:mm")}
                onChange={(e) =>
                  handleDateChange("start", new Date(e.target.value))
                }
                required
                ref={startDateRef}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="end" value="Fin" />
              </div>
              <TextInput
                type="text"
                id="end"
                value={moment(formData.end).format("YYYY-MM-DD HH:mm")}
                onChange={(e) =>
                  handleDateChange("end", new Date(e.target.value))
                }
                required
                ref={endDateRef}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="type" value="Type" />
              </div>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => handleSelectChange("type", e.target.value)}
              >
                <option value="1">Personnel</option>
                <option value="2">Scolaire</option>
                <option value="3">Professionnel</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="priority" value="Priorité" />
              </div>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleSelectChange("priority", e.target.value)}
              >
                <option value="1">Basse</option>
                <option value="2">Moyenne</option>
                <option value="3">Haute</option>
              </Select>
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" value="Description" />
            </div>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <Button color="blue" type="submit">
              {isEdit ? (
                <>
                  <Icon icon="fa6-solid:pen-to-square" className="mr-2" />{" "}
                  Mettre à jour
                </>
              ) : (
                <>
                  <Icon
                    icon="fa6-solid:plus"
                    width="16"
                    height="16"
                    className="mr-2 content-center"
                  />{" "}
                  Ajouter
                </>
              )}
            </Button>

            {isEdit && (
              <Button color="failure" onClick={() => onDeleteEvent()}>
                <Icon icon="fa6-solid:trash" className="mr-2" /> Supprimer
              </Button>
            )}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
