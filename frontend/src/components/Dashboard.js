import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Calendar from "./Dashboard/SmallCalendar";
import EventsList from "./Dashboard/EventsList";
import EventStats from "./Dashboard/EventStats";
import TimeDistribution from "./Dashboard/Charts/Time";
import EventAdd from "./EventAdd";

import Scolaire from "../pages/plannings/scolaire";
import Personnel from "../pages/plannings/personnel";
import Professionnel from "../pages/plannings/professionnel";

const Dashboard = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Header
            title="Bonjour, Marc"
            subtitle="Consultez vos dernières informations et détails"
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
            <Route
              path="/plannings/professionnel"
              element={<Professionnel />}
            />
            <Route path="/class" element={<div>Ma classe</div>} />
          </Routes>
          <EventAdd />
        </div>
      </div>
    </Router>
  );
};

export default Dashboard;
