import React, { useState, useTransition, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Dashboard/Sidebar";
import Header from "./Dashboard/Header";
import Calendar from "./Dashboard/SmallCalendar";
import EventsList from "./Dashboard/EventsList";
import EventStats from "./Dashboard/EventStats";
import TimeDistribution from "./Dashboard/Charts/Time";
import ModalEventAdd from "./Modals/ModalEventAdd";

import Scolaire from "../pages/plannings/scolaire";
import Personnel from "../pages/plannings/personnel";
import Professionnel from "../pages/plannings/professionnel";

import Chat from "../pages/class/chat";
import Members from "../pages/class/members";

import { FaPlus } from "react-icons/fa";

const Dashboard = () => {
  const location = useLocation();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("Sophie");
  const [lastname, setLastname] = useState("Dupont");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getName();
    getEmail();
    getLastname();
  }, []);

  function getName() {
    startTransition(() => {
      fetch("http://localhost:8000/users/1/name", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => setName(data))
        .catch((error) => setError(error.message));
    });
  }

  function getLastname() {
    startTransition(() => {
      fetch("http://localhost:8000/users/1/lastname", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => setLastname(data))
        .catch((error) => setError(error.message));
    });
  }

  function getEmail() {
    startTransition(() => {
      fetch("http://localhost:8000/users/1/email", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => setEmail(data))
        .catch((error) => setError(error.message));
    });
  }

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
              icon: <FaPlus />,
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
              icon: <FaPlus />,
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
              icon: <FaPlus />,
              onClick: handleShow,
            },
          ],
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar name={name} lastname={lastname} email={email} />
      <div className="flex-1 p-6">
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
          {/* <Route path="/class/chat" element={<Chat />} />
          <Route path="/class/members" element={<Members />} /> */}
        </Routes>
        <ModalEventAdd show={show} handleClose={handleClose} />
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
