import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
  const location = useLocation();

  const getHeaderProps = () => {
    switch (location.pathname) {
      case "/plannings/scolaire":
        return {
          title: "Planning scolaire",
          subtitle:
            "Consultez votre planning scolaire et modifiez vos événements",
        };
      case "/plannings/personnel":
        return {
          title: "Planning personnel",
          subtitle:
            "Consultez votre planning personnel et modifiez vos événements",
        };
      case "/plannings/professionnel":
        return {
          title: "Planning professionnel",
          subtitle:
            "Consultez votre planning professionnel et modifiez vos événements",
        };
      default:
        return {
          title: "Bonjour, Marc",
          subtitle: "Consultez vos dernières informations et détails",
        };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header title={headerProps.title} subtitle={headerProps.subtitle} />
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
                <EventAdd />
              </div>
            }
          />
          <Route path="/plannings/scolaire" element={<Scolaire />} />
          <Route path="/plannings/personnel" element={<Personnel />} />
          <Route path="/plannings/professionnel" element={<Professionnel />} />
          <Route path="/class" element={<div>Ma classe</div>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Dashboard />
  </Router>
);

export default App;
