import React, {
  useState,
  useTransition,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify-icon/react";

// Components
import SearchResults from "./SearchResults";
import Sidebar from "./Dashboard/Sidebar";
import Header from "./Dashboard/Header";
import Calendar from "./Dashboard/SmallCalendar";
import EventsList from "./Dashboard/Charts/EventsList";
import EventStats from "./Dashboard/Charts/EventStats";
import TimeDistribution from "./Dashboard/Charts/Time";
import EventModal from "./Dashboard/Modals/EventModal";

// UI components
import Loader from "@/components/ui/Loader";

// Pages
import Scolaire from "@/pages/plannings/scolaire";
import Personnel from "@/pages/plannings/personnel";
import Professionnel from "@/pages/plannings/professionnel";
import AllPlannings from "@/pages/plannings/all";
import Settings from "@/pages/Settings";

// Hooks
import useUser from "@/hooks/useUser";
import useNotification from "@/hooks/useNotification";

// Modèle par défaut pour un événement
const DEFAULT_EVENT = {
  title: "",
  start: new Date(),
  end: new Date(),
  description: "",
  type: 1,
  priority: 1,
  place: "",
};

// Configuration du header pour chaque route
const ROUTE_CONFIGS = {
  "/dashboard": {
    title: "Dashboard",
    subtitle:
      "Vue d'ensemble de vos événements et statistiques",
    showNewButton: false,
    planningTitle: "Dashboard",
  },
  "/dashboard/plannings/all": {
    title: "Tous les plannings",
    subtitle:
      "Vue d'ensemble de tous vos événements personnels, scolaires et professionnels",
    showNewButton: true,
    planningTitle: "Tous les plannings",
  },
  "/dashboard/plannings/scolaire": {
    title: "Planning scolaire",
    subtitle: "Consultez votre planning scolaire et modifiez vos événements",
    showNewButton: true,
    planningTitle: "Planning scolaire",
  },
  "/dashboard/plannings/personnel": {
    title: "Planning personnel",
    subtitle: "Consultez votre planning personnel et modifiez vos événements",
    showNewButton: true,
    planningTitle: "Planning personnel",
  },
  "/dashboard/plannings/professionnel": {
    title: "Planning professionnel",
    subtitle:
      "Consultez votre planning professionnel et modifiez vos événements",
    showNewButton: true,
    planningTitle: "Planning professionnel",
  },
  "/dashboard/settings": {
    title: "Paramètres",
    subtitle: "Mettez à jour vos informations personnelles et de sécurité",
    showNewButton: false,
    planningTitle: "Paramètres",
  },
};

/**
 * Dashboard component - Main layout
 */
const Dashboard = () => {
  // React Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Custom hooks
  const { userId, loading } = useUser();

  // State hooks
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(DEFAULT_EVENT);
  const [isPending, startTransition] = useTransition();
  const [userProfile, setUserProfile] = useState({
    name: "",
    lastname: "",
    email: "",
    school: "",
    className: "",
  });

  // Notifications
  const { error, success, info } = useNotification();

  // Constants
  const baseUrl = import.meta.env.VITE_API_URL || "";

  // Récupération des données utilisateur
  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    startTransition(async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/users/${userId}/profile`
        );

        if (response.data) {
          setUserProfile({
            name: response.data.name || "",
            lastname: response.data.lastname || "",
            email: response.data.email || "",
            school: response.data.school || "",
            className: response.data.classname || "",
          });
        }
      } catch (err) {
        const errorMessage =
          err.response?.status === 404
            ? "User profile not found"
            : err.response?.status === 403
            ? "Unauthorized access to user data"
            : err.message || "Failed to fetch user data";

        error(errorMessage, { title: "Profile Error" });
      }
    });
  }, [baseUrl, userId]);

  // Traitement de la création d'un événement
  const handleCreateEvent = useCallback(
    async (eventData) => {
      startTransition(async () => {
        try {
          const response = await fetch(`${baseUrl}/api/events/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              title: eventData.title,
              startdate: eventData.start,
              enddate: eventData.end,
              description: eventData.description || "",
              type: eventData.type || 1,
              priority: eventData.priority || 1,
              place: eventData.place || "",
            }),
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to create event");
          }

          setShowModal(false);
          success("Event created successfully", { title: "Success" });
        } catch (err) {
          error(`Event creation failed: ${err.message}`, {
            title: "Event Error",
          });
        }
      });
    },
    [baseUrl, userId]
  );
  // Traitement de la mise à jour d'un événement
  const handleUpdateEvent = useCallback(
    (eventData) => {
      console.log("Update event:", eventData);
      setShowModal(false);
      success("Event updated successfully", { title: "Success" });
    },
    [success]
  );

  // Traitement de la suppression d'un événement
  const handleDeleteEvent = useCallback(() => {
    console.log("Delete event");
    setShowModal(false);
    info("Event deleted successfully", { title: "Information" });
  }, [info]);

  // Traitement de l'affichage du modal
  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  // Traitement de la fermeture du modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Récupération des données utilisateur au chargement du composant
  useEffect(() => {
    if (userId !== null) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (userId === null && !loading) {
      sessionStorage.setItem(
        "loginMessage",
        "Veuillez vous connecter pour accéder au dashboard"
      );
      navigate("/login");
    }
  }, [userId, loading, navigate]);

  // Configuration du titre et des boutons du header en fonction de la route
  const routeConfig = useMemo(
    () =>
      ROUTE_CONFIGS[location.pathname] || {
        title: `Bonjour, ${userProfile.name}`,
        subtitle: "Consultez vos dernières informations et détails",
        showNewButton: false,
        planningTitle: "Planning",
      },
    [location.pathname, userProfile.name]
  );

  // Configuration des boutons du header
  const headerBtnData = useMemo(
    () =>
      routeConfig.showNewButton
        ? [
            {
              text: "Nouveau",
              icon: (
                <Icon
                  icon="tabler:plus"
                  width="20"
                  height="20"
                  style={{ display: "block" }}
                />
              ),
              onClick: handleShowModal,
            },
          ]
        : [],
    [routeConfig.showNewButton, handleShowModal]
  );

  // Gestion du chargement
  if (loading) {
    return <Loader loading={true} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <Loader loading={isPending} />
      <Sidebar
        data={{
          name: userProfile.name,
          lastname: userProfile.lastname,
          email: userProfile.email,
        }}
      />{" "}
      <div
        className={`flex-1 transition-all duration-300 flex flex-col h-screen
          md:ml-64`}
      >
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Header
            title={routeConfig.title}
            subtitle={routeConfig.subtitle}
            btnData={headerBtnData}
            onClick={handleShowModal}
          />

          <div className="mt-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/plannings/all"
                element={<AllPlannings />}
              />
              <Route
                path="/plannings/scolaire"
                element={<Scolaire />}
              />
              <Route
                path="/plannings/personnel"
                element={<Personnel />}
              />
              <Route
                path="/plannings/professionnel"
                element={<Professionnel />}
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    data={{
                      userId,
                      name: userProfile.name,
                      lastname: userProfile.lastname,
                      email: userProfile.email,
                      className: userProfile.className,
                      school: userProfile.school,
                    }}
                  />
                }
              />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </div>

          <EventModal
            show={showModal}
            onHide={handleCloseModal}
            event={selectedEvent}
            isEdit={false}
            onCreateEvent={handleCreateEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            planningTitle={routeConfig.planningTitle}
          />
        </div>
      </div>
    </div>
  );
};

const Home = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
      <Calendar />
      <EventsList />
    </div>
    <div className="space-y-4 md:space-y-6">
      <EventStats />
      <TimeDistribution />
    </div>
  </div>
);

export default Dashboard;
