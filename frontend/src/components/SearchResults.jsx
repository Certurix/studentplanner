import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { Icon } from "@iconify-icon/react";
import useUser from "@/hooks/useUser";
import EventModal from "./Dashboard/Modals/EventModal";
import useNotification from "@/hooks/useNotification";

const SearchResults = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const location = useLocation();
  const { userId } = useUser();
  const { success, error: showError } = useNotification();

  const fetchEvents = useCallback(
    async (query) => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        console.log("Searching for:", query, "User ID:", userId);
        console.log(
          "API URL:",
          `${import.meta.env.VITE_API_URL}/api/events/search`
        );
        console.log("Params:", { query, user_id: userId });

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/search`,
          {
            params: { query, user_id: userId },
          }
        );

        console.log("Search response status:", response.status);
        console.log("Search response data:", response.data);

        // Transform the data to match frontend expectations
        const mappedEvents = response.data.map((event) => ({
          ...event,
          id: event.ID, // Map ID to id for consistency
          type: parseInt(event.type), // Ensure type is a number
          date: new Date(event.startdate).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setEvents(mappedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Search error:", error);

        let errorMessage = "Une erreur inattendue s'est produite";

        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 404:
              errorMessage = "Service de recherche non trouvé";
              break;
            case 500:
              errorMessage = "Erreur du serveur - veuillez réessayer plus tard";
              break;
            case 401:
              errorMessage =
                "Vous devez être connecté pour effectuer une recherche";
              break;
            default:
              errorMessage = `Erreur ${status}: ${
                error.response.data?.detail || error.message
              }`;
          }
        } else if (error.request) {
          errorMessage = "Impossible de contacter le serveur";
        }

        setError(errorMessage);
        setLoading(false);
      }
    },
    [userId]
  );

  const handleEditEvent = useCallback((event) => {
    setSelectedEvent({
      ...event,
      start: new Date(event.startdate),
      end: new Date(event.enddate),
      title: event.title,
      description: event.description,
      type: event.type,
      priority: event.priority,
      place: event.place,
    });
    setShowEditModal(true);
  }, []);

  const handleDeleteEvent = useCallback((event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  }, []);

  const handleUpdateEvent = useCallback(
    async (eventData) => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/events/update/${
            selectedEvent.ID
          }`,
          {
            userId,
            title: eventData.title,
            description: eventData.description,
            type: eventData.type,
            priority: eventData.priority,
            startdate: eventData.start.toISOString(),
            enddate: eventData.end.toISOString(),
            place: eventData.place,
          }
        );

        if (response.ok || response.status === 200) {
          success("Événement modifié avec succès");
          setShowEditModal(false);
          // Refresh search results
          const query = new URLSearchParams(location.search).get("query");
          if (query) fetchEvents(query);
        }
      } catch (error) {
        showError("Erreur lors de la modification de l'événement");
      }
    },
    [selectedEvent, userId, success, showError, location.search, fetchEvents]
  );

  const confirmDeleteEvent = useCallback(async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/events/delete/${selectedEvent.ID}`
      );

      if (response.status === 200) {
        success("Événement supprimé avec succès");
        setShowDeleteModal(false);
        // Refresh search results
        const query = new URLSearchParams(location.search).get("query");
        if (query) fetchEvents(query);
      }
    } catch (error) {
      showError("Erreur lors de la suppression de l'événement");
    }
  }, [selectedEvent, success, showError, location.search, fetchEvents]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query && userId) {
      fetchEvents(query);
    }
  }, [location.search, userId, fetchEvents]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Recherche en cours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">
            Erreur de recherche
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const searchQuery = new URLSearchParams(location.search).get("query");

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Résultats de recherche
        </h2>
        <p className="text-gray-600">
          {events.length} événement{events.length !== 1 ? "s" : ""} trouvé
          {events.length !== 1 ? "s" : ""} pour "{searchQuery}"
        </p>
      </div>

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.type === 1
                        ? "bg-blue-100 text-blue-800"
                        : event.type === 2
                        ? "bg-green-100 text-green-800"
                        : event.type === 3
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.type === 1
                      ? "Personnel"
                      : event.type === 2
                      ? "Scolaire"
                      : event.type === 3
                      ? "Professionnel"
                      : "Autre"}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="xs"
                      color="gray"
                      onClick={() => handleEditEvent(event)}
                      className="p-1.5"
                    >
                      <Icon icon="tabler:edit" width={20} height={20} />
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => handleDeleteEvent(event)}
                      className="p-1.5"
                    >
                      <Icon icon="tabler:trash" width={20} height={20} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {event.date}
              </div>
              {event.place && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {event.place}
                </div>
              )}
              {event.description && (
                <p className="text-sm text-gray-700 mt-2">
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-600">
            Aucun événement ne correspond à votre recherche "{searchQuery}".
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Essayez avec d'autres mots-clés ou vérifiez l'orthographe.
          </p>
        </div>
      )}

      {/* Edit Event Modal */}
      <EventModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        event={selectedEvent}
        isEdit={true}
        onUpdateEvent={handleUpdateEvent}
        planningTitle="Recherche"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="md"
      >
        <Modal.Header>Supprimer l'événement</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Icon
              icon="tabler:alert-triangle"
              className="mx-auto mb-4 text-red-500"
              width={48}
              height={48}
            />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Êtes-vous sûr de vouloir supprimer l'événement "
              {selectedEvent?.title}" ?
            </h3>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button color="failure" onClick={confirmDeleteEvent}>
            Oui, supprimer
          </Button>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default SearchResults;
