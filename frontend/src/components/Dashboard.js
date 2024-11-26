import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Calendar from './Dashboard/SmallCalendar';
import EventsList from './Dashboard/EventsList';
import EventStats from './Dashboard/EventStats';
import TimeDistribution from './Dashboard/Charts/Time';
import EventAdd from './EventAdd';

import Plannings from '../pages/Plannings';

const Dashboard = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Header />
          <Routes>
            <Route path="/" element={
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
            } />
            <Route path="/plannings" element={<Plannings/>} />
            <Route path="/class" element={<div>Ma classe</div>} />
          </Routes>
          <EventAdd />
        </div>
      </div>
    </Router>
  );
}

export default Dashboard;