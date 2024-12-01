// frontend/src/components/Dashboard.js

import React, { useState } from "react";
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
          title: "Bonjour, Marc",
          subtitle: "Consultez vos dernières informations et détails",
          btnData: [
            {
              text: "Ajouter un événement",
              onClick: handleShow,
            },
          ],
        };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header
          title={headerProps.title}
          subtitle={headerProps.subtitle}
          btnData={headerProps.btnData}
          onClick={handleShow}
        />
        <Routes>
          <Route
            path="/"
            element={
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
            }
          />
          <Route path="/plannings/scolaire" element={<Scolaire />} />
          <Route path="/plannings/personnel" element={<Personnel />} />
          <Route path="/plannings/professionnel" element={<Professionnel />} />
          <Route path="/class/chat" element={<Chat />} />
          <Route path="/class/members" element={<Members />} />
        </Routes>

        <ModalEventAdd show={show} handleClose={handleClose} />
      </div>
    </div>
  );
};

export default Dashboard;
