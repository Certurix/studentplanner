import React, { useState, useTransition, useEffect, useCallback } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "./Dashboard/Sidebar";
import Header from "./Dashboard/Header";
import Calendar from "./Dashboard/SmallCalendar";
import EventsList from "./Dashboard/Events/EventsList";
import EventStats from "./Dashboard/Events/EventStats";
import TimeDistribution from "./Dashboard/Charts/Time";

import Scolaire from "../pages/plannings/scolaire";
import Personnel from "../pages/plannings/personnel";
import Professionnel from "../pages/plannings/professionnel";

import { Icon } from "@iconify-icon/react";
import SearchResults from "./SearchResults";
import Settings from "../pages/Settings";
import Alert from "@/components/ui/Alert";
import Loader from "@/components/ui/Loader";
import useUser from "../hooks/useUser";
import EventModal from "./Dashboard/Events/EventModal";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, loading } = useUser();
  const [show, setShow] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
    type: 1,
    priority: 1,
    place: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "";

  const getUserData = useCallback((field, setter) => {
    startTransition(() => {
      axios
        .get(`${baseUrl}/api/users/${userId}/${field}`)
        .then((response) => setter(response.data))
        .catch((error) =>
          setError(error.message || "Network response was not ok")
        );
    });
  }, [baseUrl, userId, startTransition]);

  useEffect(() => {
    if (userId !== null) {
      getUserData("name", setName);
      getUserData("lastname", setLastname);
      getUserData("email", setEmail);
      getUserData("school", setSchool);
      getUserData("classname", setClassName);
    }
  }, [userId, getUserData]);

  if (loading) {
    return <Loader loading={true} />;
  }

  if (userId === null) {
    sessionStorage.setItem(
      "loginMessage",
      "Veuillez vous connecter pour accéder au dashboard"
    );
    navigate("/login");
    return null;
  }

  const handleCreateEvent = (eventData) => {
    startTransition(() => {
      fetch(`${baseUrl}/api/events/create`, {
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
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(() => {
          handleClose();
        })
        .catch(setError);
    });
  };

  const handleUpdateEvent = (eventData) => {
    console.log("Update event:", eventData);
    handleClose();
  };

  const handleDeleteEvent = () => {
    console.log("Delete event");
    handleClose();
  };

  const getHeaderProps = () => {
    switch (location.pathname) {
      case "/plannings/scolaire":
        return {
          title: "Planning scolaire",
          subtitle:
            "Consultez votre planning scolaire et modifiez vos événements",
          btnData: [
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
              onClick: handleShow,
            },
          ],
        };
      case "/plannings/personnel":
        return {
          title: "Planning personnel",
          subtitle:
            "Consultez votre planning personnel et modifiez vos événements",
          btnData: [
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
              onClick: handleShow,
            },
          ],
        };
      case "/plannings/professionnel":
        return {
          title: "Planning professionnel",
          subtitle:
            "Consultez votre planning professionnel et modifiez vos événements",
          btnData: [
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
              onClick: handleShow,
            },
          ],
        };
      case "/settings":
        return {
          title: "Paramètres",
          subtitle:
            "Mettez à jour vos informations personnelles et de sécurité",
          btnData: [],
        };
      default:
        return {
          title: `Bonjour, ${name}`,
          subtitle: "Consultez vos dernières informations et détails",
          btnData: [],
        };
    }
  };

  const headerProps = getHeaderProps();

  const getPlanningTitle = () => {
    if (location.pathname.includes("scolaire")) return "Planning scolaire";
    if (location.pathname.includes("personnel")) return "Planning personnel";
    if (location.pathname.includes("professionnel"))
      return "Planning professionnel";
    return "Planning";
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <Loader loading={isPending} />
      <Sidebar data={{ name, lastname, email }} />
      <div className="flex-1 p-6">
        {error && <Alert type="error" message={error} title="Erreur" />}
        <Header
          title={headerProps.title}
          subtitle={headerProps.subtitle}
          btnData={headerProps.btnData}
          onClick={handleShow}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plannings/scolaire" element={<Scolaire />} />
          <Route path="/plannings/personnel" element={<Personnel />} />
          <Route path="/plannings/professionnel" element={<Professionnel />} />
          <Route
            path="/settings"
            element={
              <Settings
                data={{ userId, name, lastname, email, className, school }}
              />
            }
          />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
        <EventModal
          show={show}
          onHide={handleClose}
          event={selectedEvent}
          isEdit={false}
          onCreateEvent={handleCreateEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          planningTitle={getPlanningTitle()}
        />
      </div>
    </div>
  );
};

const Home = () => (
  <div className="grid grid-cols-3 gap-6">
    <div className="col-span-2 space-y-6">
      <Calendar />
      <EventsList />
    </div>
    <div className="space-y-6">
      <EventStats />
      <TimeDistribution />
    </div>
  </div>
);

export default Dashboard;
